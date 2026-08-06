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

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  "rajbiosis-central";

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

let adminDb = null;

if (projectId && clientEmail && privateKey) {
  try {
    const app =
      getApps().length === 0
        ? initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey,
            }),
          })
        : getApps()[0];

    adminDb = getFirestore(app);
  } catch (err) {
    console.error("Firebase Admin initialization error:", err);
  }
} else {
  console.warn(
    "Firebase Admin environment variables missing or incomplete during build. Fallback gracefully."
  );
}

export { adminDb };