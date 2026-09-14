import { db, collection, doc, getDoc, getDocs } from "./firebase.js";

/**
 * Edge-compatible Firestore wrapper that mimics firebase-admin Firestore API
 * using lightweight Firestore REST calls for 100% Cloudflare Workers compatibility.
 */
function createRef(...segments) {
  return {
    collection: (name) => createRef(...segments, name),
    doc: (id) => createRef(...segments, id),
    get: async () => {
      try {
        if (segments.length % 2 === 0) {
          // Document path (e.g. websites/humanbiomedicalscoin/pages/products)
          const docRef = doc(db, ...segments);
          const snap = await getDoc(docRef);
          return {
            exists: snap.exists(),
            id: snap.id,
            data: () => snap.data() || {},
          };
        } else {
          // Collection path (e.g. websites/humanbiomedicalscoin/districts)
          const colRef = collection(db, ...segments);
          const snap = await getDocs(colRef);
          return {
            docs: snap.docs.map((d) => ({
              id: d.id,
              data: () => d.data() || {},
            })),
          };
        }
      } catch (err) {
        console.error("Firestore read error in firebaseAdmin wrapper:", err);
        return {
          exists: false,
          id: "",
          data: () => ({}),
          docs: [],
        };
      }
    },
  };
}

export const adminDb = {
  collection: (name) => createRef(name),
  doc: (id) => createRef(id),
};