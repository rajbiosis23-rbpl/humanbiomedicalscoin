import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  return (
    <ProductsClient
      initialProducts={allProducts}
      district={district}
      city={city}
    />
  );
}