export async function generateMetadata({
  params,
}) {
  const district =
    decodeURIComponent(
      params.district
    )
      .replace(/-/g, " ")
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );

  const slug =
    params.district;

  return {
    title: `Biomedical Products in ${district} | Diagnostic & Laboratory Equipment | Human Biomedicals`,

    description: `Buy biomedical, pathology, diagnostic machines, CBC machines, laboratory and hospital equipment in ${district}. Trusted supplier with installation, support & best pricing from Human Biomedicals.`,

    keywords: [
      `Biomedical Products in ${district}`,
      `Diagnostic Equipment in ${district}`,
      `Laboratory Equipment in ${district}`,
      `Hospital Equipment in ${district}`,
      `Medical Equipment Supplier ${district}`,
      `CBC Machine in ${district}`,
      `Pathology Equipment in ${district}`,
      `Biomedical Supplier India`,
      `Diagnostic Machine Supplier`,
      `Human Biomedicals`
    ],

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: `https://globalbiomedical.org/${slug}/items`,
    },

    openGraph: {
      title: `Biomedical Products in ${district} | Huamn Biomedicals`,
      description: `Trusted supplier of biomedical, pathology, laboratory & diagnostic equipment in ${district}.`,
      url: `https://globalbiomedical.org/${slug}/items`,
      siteName: "Human Biomedicals",
      locale: "en_IN",
      type: "website",

      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: `Biomedical Products in ${district}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `Biomedical Products in ${district} | Human Biomedicals`,
      description: `Trusted biomedical equipment supplier in ${district}.`,
      images: ["/logo.png"],
    },
  };
}

// YE ADD KARNA IMPORTANT HAI
export default function Layout({
  children,
}) {
  return <>{children}</>;
}