/**
 * Edge-compatible Firestore REST client for Cloudflare Workers & Next.js SSR
 * Completely avoids protobufjs / new Function / eval to prevent EvalError on Cloudflare Workers.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "rajbiosis-central";
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDGIJXX3MR1CxmIJbJHyVzbfRa0M0Sw6FQ";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

export function decodeFirestoreValue(value) {
  if (value === undefined || value === null) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return Boolean(value.booleanValue);
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("timestampValue" in value) {
    const date = new Date(value.timestampValue);
    const seconds = Math.floor(date.getTime() / 1000);
    const nanoseconds = (date.getTime() % 1000) * 1000000;
    return {
      toDate: () => date,
      toMillis: () => date.getTime(),
      seconds,
      nanoseconds,
      toISOString: () => value.timestampValue,
      toString: () => value.timestampValue,
      valueOf: () => date.getTime(),
    };
  }
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) {
    return (value.arrayValue?.values || []).map(decodeFirestoreValue);
  }
  if ("mapValue" in value) {
    return decodeFirestoreFields(value.mapValue?.fields || {});
  }
  return null;
}

export function decodeFirestoreFields(fields = {}) {
  const result = {};
  for (const [key, value] of Object.entries(fields)) {
    result[key] = decodeFirestoreValue(value);
  }
  return result;
}

export function encodeFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (val instanceof Date) {
    return { timestampValue: val.toISOString() };
  }
  if (val === "SERVER_TIMESTAMP" || (typeof val === "object" && (val?._isServerTimestamp || val?.isServerTimestamp))) {
    return { timestampValue: new Date().toISOString() };
  }
  if (typeof val === "object" && typeof val?.toDate === "function") {
    return { timestampValue: val.toDate().toISOString() };
  }
  if (typeof val === "object" && typeof val?.seconds === "number") {
    return { timestampValue: new Date(val.seconds * 1000).toISOString() };
  }
  if (typeof val === "string") return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(encodeFirestoreValue) } };
  }
  if (typeof val === "object") {
    return { mapValue: { fields: encodeFirestoreFields(val) } };
  }
  return { stringValue: String(val) };
}

export function encodeFirestoreFields(obj = {}) {
  const fields = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      fields[key] = encodeFirestoreValue(value);
    }
  }
  return fields;
}

function resolvePath(segments) {
  return segments
    .filter(Boolean)
    .map((s) => (typeof s === "object" && s.path ? s.path : String(s)))
    .join("/")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "");
}

export function doc(dbOrCol, ...segments) {
  const start = dbOrCol && dbOrCol.path ? [dbOrCol.path] : [];
  return {
    type: "doc",
    path: resolvePath([...start, ...segments]),
  };
}

export function collection(dbOrDoc, ...segments) {
  const start = dbOrDoc && dbOrDoc.path ? [dbOrDoc.path] : [];
  return {
    type: "collection",
    path: resolvePath([...start, ...segments]),
  };
}

export function where(field, op, value) {
  return {
    type: "where",
    field,
    op: op === "==" ? "EQUAL" : op,
    value,
  };
}

export function query(colRef, ...constraints) {
  return {
    type: "query",
    colRef,
    path: colRef?.path || "",
    constraints,
  };
}

export async function getDoc(docRef) {
  const path = typeof docRef === "string" ? docRef : docRef?.path;
  if (!path) return { exists: () => false, id: "", data: () => ({}) };

  const url = `${BASE_URL}/${path}?key=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return { exists: () => false, id: path.split("/").pop(), data: () => ({}) };
    }
    const json = await res.json();
    const data = decodeFirestoreFields(json.fields);
    const id = json.name ? json.name.split("/").pop() : path.split("/").pop();
    return {
      exists: () => true,
      id,
      data: () => data,
    };
  } catch (err) {
    console.error(`Firestore getDoc error for ${path}:`, err);
    return { exists: () => false, id: path.split("/").pop(), data: () => ({}) };
  }
}

export async function getDocs(target) {
  if (target?.type === "query") {
    const colPath = target.path;
    const whereConstraint = target.constraints?.find((c) => c.type === "where");

    if (whereConstraint) {
      const parentPath = colPath.includes("/") ? colPath.substring(0, colPath.lastIndexOf("/")) : "";
      const collectionId = colPath.split("/").pop();
      const runQueryUrl = parentPath
        ? `${BASE_URL}/${parentPath}:runQuery?key=${API_KEY}`
        : `${BASE_URL}:runQuery?key=${API_KEY}`;

      try {
        const queryBody = {
          structuredQuery: {
            from: [{ collectionId }],
            where: {
              fieldFilter: {
                field: { fieldPath: whereConstraint.field },
                op: whereConstraint.op || "EQUAL",
                value: encodeFirestoreValue(whereConstraint.value),
              },
            },
          },
        };

        const res = await fetch(runQueryUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(queryBody),
          next: { revalidate: 3600 },
        });

        if (!res.ok) {
          return { docs: [], empty: true, forEach: () => {} };
        }

        const json = await res.json();
        const docs = (json || [])
          .filter((item) => item.document)
          .map((item) => {
            const doc = item.document;
            const id = doc.name.split("/").pop();
            const data = decodeFirestoreFields(doc.fields);
            return {
              id,
              data: () => data,
              exists: () => true,
            };
          });

        return {
          docs,
          empty: docs.length === 0,
          forEach: (cb) => docs.forEach(cb),
        };
      } catch (err) {
        console.error(`Firestore runQuery error for ${colPath}:`, err);
        return { docs: [], empty: true, forEach: () => {} };
      }
    }
  }

  const path = typeof target === "string" ? target : target?.path;
  if (!path) return { docs: [], empty: true, forEach: () => {} };

  const url = `${BASE_URL}/${path}?key=${API_KEY}&pageSize=300`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return { docs: [], empty: true, forEach: () => {} };
    }
    const json = await res.json();
    const rawDocs = json.documents || [];
    const docs = rawDocs.map((d) => {
      const id = d.name.split("/").pop();
      const data = decodeFirestoreFields(d.fields);
      return {
        id,
        data: () => data,
        exists: () => true,
      };
    });
    return {
      docs,
      empty: docs.length === 0,
      forEach: (cb) => docs.forEach(cb),
    };
  } catch (err) {
    console.error(`Firestore getDocs error for ${path}:`, err);
    return { docs: [], empty: true, forEach: () => {} };
  }
}

export async function addDoc(colRef, data) {
  const path = typeof colRef === "string" ? colRef : colRef?.path;
  const url = `${BASE_URL}/${path}?key=${API_KEY}`;
  
  // Format data
  const payloadData = { ...data };
  if (payloadData.createdAt === undefined || payloadData.createdAt === null) {
    payloadData.createdAt = new Date();
  }

  const payload = {
    fields: encodeFirestoreFields(payloadData),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Firestore addDoc failed (${res.status}): ${errText}`);
  }

  const json = await res.json();
  const id = json.name ? json.name.split("/").pop() : "";
  return { id };
}

export function serverTimestamp() {
  return { _isServerTimestamp: true };
}

export function setLogLevel() {}
export function initializeApp() { return {}; }
export function getFirestore() { return { path: "" }; }
export function getAuth() { return {}; }

export const db = { path: "" };
export const auth = {};