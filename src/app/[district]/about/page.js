import AboutPage from "@/app/about/page";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// DYNAMIC DISTRICTS
export async function generateStaticParams() {
  try {
    const snapshot = await getDocs(
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

export default async function Page({
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

  console.log(city);

  return (
    <AboutPage city={city} />
  );
}