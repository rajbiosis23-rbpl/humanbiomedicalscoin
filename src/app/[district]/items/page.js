import ProductsPage from "@/app/items/page";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

// FIREBASE DISTRICTS
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

// SEO METADATA
export async function generateMetadata({
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

  // 35+ SEO KEYWORDS
  const keywords = [

    `maglumi machine in ${city}`,
    `maglumi machine supplier ${city}`,
    `cbc machine in ${city}`,
    `cbc analyzer in ${city}`,
    `elisa reader in ${city}`,
    `elisa machine in ${city}`,
    `pathology equipment in ${city}`,
    `pathology lab equipment in ${city}`,
    `biomedical products in ${city}`,
    `biomedical equipment in ${city}`,
    `hospital equipment in ${city}`,
    `medical equipment supplier ${city}`,
    `diagnostic equipment in ${city}`,
    `diagnostic machines in ${city}`,
    `laboratory equipment in ${city}`,
    `biochemistry analyzer ${city}`,
    `hematology analyzer ${city}`,
    `chemistry analyzer ${city}`,
    `lab instruments in ${city}`,
    `medical devices in ${city}`,
    `hospital machines in ${city}`,
    `medical lab equipment ${city}`,
    `medical instruments ${city}`,
    `pathology machines ${city}`,
    `fully automatic analyzer ${city}`,
    `semi auto analyzer ${city}`,
    `hospital diagnostic equipment ${city}`,
    `lab testing machines ${city}`,
    `healthcare equipment ${city}`,
    `diagnostic supplier ${city}`,
    `cbc machine supplier ${city}`,
    `medical machine supplier ${city}`,
    `maglumi in ${city}`,
    `Human Biomedicals ${city}`,
    `best biomedical supplier ${city}`,
  ];

  console.log(
    "SEO Keywords:",
    keywords
  );

  return {
    title:
      `Maglumi Machine in ${city} | Biomedical Products in ${city} | Human Biomedicals`,

    description:
      `Buy Maglumi machine, CBC analyzer, Elisa reader, pathology lab equipment, biomedical products and hospital diagnostic machines in ${city}. Trusted supplier Human Biomedicals.`,

    keywords,

    alternates: {
      canonical:
        `https://humanbiomedicals.co.in/${district}/items`,
    },

    openGraph: {
      title:
        `Biomedical Products in ${city} | Human Biomedicals`,

      description:
        `Top biomedical products, Maglumi machines, pathology lab and diagnostic equipment supplier in ${city}.`,

      url:
        `https://humanbiomedicals.co.in/${district}/items`,

      siteName:
        "Human Biomedicals",

      locale:
        "en_IN",

      type:
        "website",

      images: [
        {
          url:
            "/images/logo.png",
          width: 1200,
          height: 630,
          alt:
            `Biomedical Products in ${city}`,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        `Biomedical Products in ${city} | Human Biomedicals`,

      description:
        `Trusted biomedical and pathology equipment supplier in ${city}.`,

      images: [
        "/images/logo.png",
      ],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
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

  return (
    <ProductsPage
      city={city}
    />
  );
}