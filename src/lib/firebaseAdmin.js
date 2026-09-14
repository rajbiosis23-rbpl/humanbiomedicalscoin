// import admin from "firebase-admin";

// let adminDb = null;

// // const projectId =
// //   process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
// const projectId =
//   process.env.FIREBASE_PROJECT_ID;

// const clientEmail =
//   process.env.FIREBASE_CLIENT_EMAIL;

// const privateKey =
//   process.env.FIREBASE_PRIVATE_KEY?.replace(
//     /\\n/g,
//     "\n"
//   );

// console.log("ENV CHECK:", {
//   projectId,
//   clientEmail,
//   hasPrivateKey: !!privateKey,
// });

// if (
//   projectId &&
//   clientEmail &&
//   privateKey
// ) {
//   if (!admin.apps.length) {
//     admin.initializeApp({
//       credential:
//         admin.credential.cert({
//           projectId: String(projectId),
//           clientEmail: String(clientEmail),
//           privateKey: String(privateKey),
//         })
//     });
//   }

//   adminDb = admin.firestore();
// }

// export { adminDb };

import { db } from "./firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

/**
 * Edge-compatible Firestore wrapper that mimics firebase-admin Firestore API
 * using standard web-friendly Firebase JS SDK for Cloudflare Workers compatibility.
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