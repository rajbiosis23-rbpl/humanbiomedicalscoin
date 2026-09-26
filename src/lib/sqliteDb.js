import path from "node:path";
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";

let dbInstance = null;
let dbPathResolved = null;

function resolveDbPath() {
  if (dbPathResolved && fs.existsSync(/*turbopackIgnore: true*/ dbPathResolved)) {
    return dbPathResolved;
  }

  const candidates = [
    process.env.SQLITE_DB_PATH,
    path.resolve(process.cwd(), "../SuperAdminRBPL/data/catalog.db"),
    path.resolve(process.cwd(), "../../SuperAdminRBPL/data/catalog.db"),
    path.resolve("c:/Users/Admin/Documents/GitHub/SuperAdminRBPL/data/catalog.db"),
    path.resolve(process.cwd(), "./data/catalog.db"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ candidate)) {
        dbPathResolved = candidate;
        console.log("[sqliteDb] Resolved DB path to:", candidate);
        return candidate;
      }
    } catch {
      // Ignore filesystem permission errors
    }
  }

  console.warn("[sqliteDb] No SQLite DB found among candidates:", candidates);
  return null;
}

/**
 * Returns read-only SQLite database connection instance using node:sqlite DatabaseSync
 */
export function getSqliteDb() {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = resolveDbPath();
  if (!dbPath) {
    return null;
  }

  try {
    dbInstance = new DatabaseSync(dbPath, { readOnly: true });
    console.log("[sqliteDb] DatabaseSync opened successfully on:", dbPath);
    return dbInstance;
  } catch (err) {
    console.warn("[sqliteDb] Could not initialize node:sqlite DatabaseSync:", err.message);
    return null;
  }
}

/**
 * Fetch single document by full path from SQLite documents table
 */
export function getDocFromSqlite(docPath) {
  if (!docPath) return { exists: false, id: "", data: null };

  const db = getSqliteDb();
  if (!db) return { exists: false, id: "", data: null };

  try {
    const normalizedPath = String(docPath).replace(/^\/+|\/+$/g, "");
    const stmt = db.prepare("SELECT path, collection_path, doc_id, data, updated_at FROM documents WHERE path = ? LIMIT 1");
    const row = stmt.get(normalizedPath);

    if (!row || !row.data) {
      return { exists: false, id: normalizedPath.split("/").pop(), data: null };
    }

    let parsed = null;
    try {
      parsed = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
    } catch {
      parsed = row.data;
    }

    return {
      exists: true,
      id: row.doc_id || normalizedPath.split("/").pop(),
      path: row.path,
      data: parsed,
      updatedAt: row.updated_at,
    };
  } catch (err) {
    console.error(`[sqliteDb] Error getting doc for ${docPath}:`, err);
    return { exists: false, id: "", data: null };
  }
}

/**
 * Fetch all documents in a collection_path from SQLite documents table
 */
export function getCollectionFromSqlite(collectionPath) {
  if (!collectionPath) return [];

  const db = getSqliteDb();
  if (!db) return [];

  try {
    const normalizedCol = String(collectionPath).replace(/^\/+|\/+$/g, "");
    const stmt = db.prepare("SELECT path, collection_path, doc_id, data, updated_at FROM documents WHERE collection_path = ?");
    const rows = stmt.all(normalizedCol);

    return (rows || []).map((row) => {
      let parsed = null;
      try {
        parsed = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
      } catch {
        parsed = row.data;
      }
      return {
        id: row.doc_id || row.path?.split("/").pop(),
        path: row.path,
        data: parsed,
        updatedAt: row.updated_at,
      };
    });
  } catch (err) {
    console.error(`[sqliteDb] Error getting collection for ${collectionPath}:`, err);
    return [];
  }
}

/**
 * Fetch documents where path starts with pathPrefix
 */
export function getDocsByPrefix(pathPrefix) {
  if (!pathPrefix) return [];

  const db = getSqliteDb();
  if (!db) return [];

  try {
    const normalizedPrefix = String(pathPrefix).replace(/^\/+/, "");
    const stmt = db.prepare("SELECT path, collection_path, doc_id, data, updated_at FROM documents WHERE path LIKE ?");
    const rows = stmt.all(`${normalizedPrefix}%`);

    return (rows || []).map((row) => {
      let parsed = null;
      try {
        parsed = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
      } catch {
        parsed = row.data;
      }
      return {
        id: row.doc_id || row.path?.split("/").pop(),
        path: row.path,
        data: parsed,
        updatedAt: row.updated_at,
      };
    });
  } catch (err) {
    console.error(`[sqliteDb] Error getting docs by prefix ${pathPrefix}:`, err);
    return [];
  }
}
