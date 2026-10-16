import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "./ProductsClient";

export const revalidate = 60;

export async function generateMetadata() {
  const url = "https://humanbiomedicals.co.in/items";
  return {
    title: "Biomedical Equipment Catalog | Pathology & Laboratory Analyzers | Human Biomedicals",
    description: "Explore advanced biomedical equipment, biochemistry analyzers, hematology analyzers, test strips, and pathology lab instruments supplied across India by Human Biomedicals.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "Biomedical Equipment Catalog | Human Biomedicals",
      description: "Premier supplier of laboratory analyzers, medical equipment, and diagnostic consumables across India.",
      url,
      type: "website",
    },
  };
}

export default async function ProductsPage({ district = null, city = null }) {
  const allProducts = await fetchFullCatalog();
  const canonicalUrl = district
    ? `https://humanbiomedicals.co.in/${district}/items`
    : "https://humanbiomedicals.co.in/items";

  const supplierSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalEquipmentSupplier",
    name: "Human Biomedicals",
    url: canonicalUrl,
    areaServed: city || "India",
    description: `Leading supplier of medical laboratory, diagnostic and hospital equipment${city ? ` in ${city}` : " in India"}.`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city || "Jaipur",
      addressCountry: "India",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(supplierSchema) }}
      />
      <ProductsClient
        initialProducts={allProducts}
        district={district}
        city={city}
      />
    </>
  );
}