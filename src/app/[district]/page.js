export async function generateMetadata({
  params,
}) {

  const resolvedParams =
    await params;

  const district =
    resolvedParams?.district || "";

  const city = district
    ? district
        .replace(/-/g, " ")
        .replace(
          /\b\w/g,
          (char) =>
            char.toUpperCase()
        )
    : "India";

  // BROAD + LONGTAIL + INTENT SEO
  const keywords = [

    // Main Biomedical
    `biomedical products in ${city}`,
    `biomedical supplier in ${city}`,
    `biomedical equipment in ${city}`,
    `best biomedical company in ${city}`,

    // Maglumi
    `maglumi machine in ${city}`,
    `maglumi supplier ${city}`,
    `maglumi machine price ${city}`,
    `maglumi distributor ${city}`,
    `maglumi diagnostic machine ${city}`,

    // CBC
    `cbc machine in ${city}`,
    `cbc analyzer in ${city}`,
    `cbc machine supplier ${city}`,
    `blood testing machine ${city}`,

    // Elisa
    `elisa reader in ${city}`,
    `elisa machine in ${city}`,
    `elisa washer in ${city}`,

    // Pathology
    `pathology equipment in ${city}`,
    `pathology lab equipment in ${city}`,
    `pathology machine supplier ${city}`,
    `pathology products ${city}`,

    // Hospital
    `hospital equipment in ${city}`,
    `hospital machines in ${city}`,
    `medical devices in ${city}`,
    `medical machine supplier ${city}`,

    // Lab
    `laboratory equipment in ${city}`,
    `lab instruments in ${city}`,
    `medical lab equipment ${city}`,
    `diagnostic lab products ${city}`,

    // Analyzer
    `biochemistry analyzer ${city}`,
    `hematology analyzer ${city}`,
    `chemistry analyzer ${city}`,
    `fully automatic analyzer ${city}`,
    `semi auto analyzer ${city}`,

    // Intent Based
    `best diagnostic equipment supplier ${city}`,
    `best pathology supplier ${city}`,
    `hospital lab equipment ${city}`,
    `medical equipment near me ${city}`,
    `diagnostic machines near me ${city}`,
    `pathology machine dealer ${city}`,

    // Brand
    `rajbiosis ${city}`,
    `rajbiosis biomedical ${city}`,
  ];

  console.log(
    `SEO Keywords ${city}:`,
    keywords
  );

  const title = district
    ? `Maglumi Machine in ${city} | CBC Analyzer, Elisa Reader & Biomedical Products | RajBiosis`
    : `RajBiosis | Biomedical Products, Diagnostic & Pathology Equipment in India`;

  const description =
    district
      ? `Buy Maglumi machines, CBC analyzers, Elisa readers, pathology lab equipment, diagnostic machines and biomedical products in ${city}. Trusted supplier for hospitals, clinics & laboratories.`
      : `RajBiosis supplies biomedical products, pathology lab equipment, CBC analyzers, Elisa readers, hospital and diagnostic machines across India.`;

  const url = district
    ? `https://rajbiosis.com/${district}`
    : "https://rajbiosis.com";

  return {
    title,
    description,
    keywords,

    metadataBase: new URL(
      "https://rajbiosis.com"
    ),

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName:
        "RajBiosis",
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
            `RajBiosis Biomedical Products ${city}`,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,
      images: [
        "/images/logo.png",
      ],
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,

      googleBot: {
        index: true,
        follow: true,
        noimageindex:
          false,
        "max-image-preview":
          "large",
        "max-snippet":
          -1,
      },
    },
  };
}