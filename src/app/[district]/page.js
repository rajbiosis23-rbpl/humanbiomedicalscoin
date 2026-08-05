import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import WhyChoose from "@/components/home/WhyChoose";
// import ProductShowcase from "@/components/home/itemshowcase";
import Testimonials from "@/components/home/Testimonials";
// import FAQ from "@/components/home/FAQ";
// import Newsletter from "@/components/home/Newsletter";

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

  const title = district
    ? `Biomedical Equipment Supplier in ${city} | Maglumi, CBC Analyzer & Elisa Reader`
    : `Human Biomedicals | Biomedical Equipment Supplier in India`;

  const description =
    district
      ? `Human Biomedicals is a trusted biomedical equipment supplier in ${city}. We provide Maglumi machines, CBC analyzers, Elisa readers, pathology laboratory equipment, hospital instruments and diagnostic machines for laboratories, hospitals and healthcare facilities.`
      : `Human Biomedials supplies biomedical products, pathology lab equipment, CBC analyzers, Elisa readers, hospital equipment and diagnostic machines across India.`;

  const keywords = [

    // Biomedical
    `biomedical equipment supplier in ${city}`,
    `biomedical products in ${city}`,
    `biomedical equipment in ${city}`,
    `biomedical company in ${city}`,
    `medical equipment supplier in ${city}`,

    // Diagnostic
    `diagnostic equipment supplier in ${city}`,
    `diagnostic machines in ${city}`,
    `diagnostic lab equipment in ${city}`,

    // Pathology
    `pathology equipment in ${city}`,
    `pathology lab equipment in ${city}`,
    `pathology machine supplier in ${city}`,
    `pathology machine dealer in ${city}`,

    // Hospital
    `hospital equipment supplier in ${city}`,
    `hospital machines in ${city}`,
    `medical devices in ${city}`,

    // Laboratory
    `laboratory equipment in ${city}`,
    `lab equipment supplier in ${city}`,
    `lab instruments in ${city}`,
    `medical lab equipment in ${city}`,

    // Maglumi
    `maglumi machine in ${city}`,
    `maglumi supplier in ${city}`,
    `maglumi distributor in ${city}`,
    `maglumi machine price in ${city}`,
    `maglumi diagnostic machine in ${city}`,

    // CBC
    `cbc analyzer in ${city}`,
    `cbc machine in ${city}`,
    `cbc machine supplier in ${city}`,
    `cbc analyzer dealer in ${city}`,
    `blood testing machine in ${city}`,

    // Elisa
    `elisa reader in ${city}`,
    `elisa machine in ${city}`,
    `elisa washer in ${city}`,

    // Analyzer
    `biochemistry analyzer in ${city}`,
    `hematology analyzer in ${city}`,
    `chemistry analyzer in ${city}`,
    `fully automatic analyzer in ${city}`,
    `semi auto analyzer in ${city}`,

    // Intent
    `best biomedical supplier in ${city}`,
    `best pathology supplier in ${city}`,
    `best diagnostic equipment supplier in ${city}`,
    `medical equipment near me ${city}`,
    `diagnostic machines near me ${city}`,

    // Brand
    `Human Biomedicals ${city}`,
  ];

  const url = district
    ? `https://humanbiomedials.co.in/${district}`
    : `https://humanbiomedials.co.in`;

  return {
    title,
    description,
    keywords,

    metadataBase: new URL(
      "https://humanbiomedials.co.in"
    ),

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName:
        "Human Biomedials",
      locale: "en_IN",
      type: "website",

      images: [
        {
          url: "/images/logo.png",
          width: 1200,
          height: 630,
          alt:
            `Biomedical Equipment Supplier in ${city}`,
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
        noimageindex: false,
        "max-image-preview":
          "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function DistrictPage({
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

  return (
    <>
      <Hero city={city} />

      <Stats />

      <WhyChoose />

      {/* <ProductShowcase /> */}

      <Testimonials />


      {/* <FAQ /> */}

      {/* <Newsletter /> */}
    </>
  );
}