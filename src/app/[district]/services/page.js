import Services from "@/app/services/page";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

// FIREBASE SE DISTRICT
export async function generateStaticParams() {
  try {
    const snapshot =
      await getDocs(
        collection(
          db,
          "websites",
          "humanbiomedicalscoin",
          "districts"
        )
      );

    return snapshot.docs.map(
      (doc) => ({
        district: doc.id,
      })
    );
  } catch (error) {
    console.error(
      "District fetch error:",
      error
    );

    return [];
  }
}

export default async function DistrictServicesPage({
  params,
}) {

  const resolvedParams =
    await params;

  const district =
    resolvedParams?.district ||
    "";

  const city = district
    .replace(/-/g, " ")
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );

  return (
    <Services
      city={city}
    />
  );
}