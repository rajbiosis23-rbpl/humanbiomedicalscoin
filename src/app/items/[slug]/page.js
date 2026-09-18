import ProductDetails from "./ProductDetails";
import { fetchFullCatalog, getProductBySlug } from "@/lib/data-fetcher-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const productName = product?.title || slug
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase());

  const brand = product?.brand || "Human Biomedicals";
  const title = `${productName} Supplier in India | Price, Dealer & Distributor | ${brand}`;
  const description = product?.desc
    ? `${product.desc.slice(0, 150)}... Buy ${productName} at best price in India from ${brand}.`
    : `Buy ${productName} at best price in India. Trusted supplier, dealer and distributor of ${productName} for hospitals, laboratories, diagnostic centers, research institutes and healthcare facilities. Contact Human Biomedicals for latest quotation and product details.`;

  const url = `https://humanbiomedicals.co.in/items/${slug}`;
  const imageUrl = product?.images?.[0] || product?.image || "/images/logo.png";

  return {
    title,
    description,
    keywords: [
      productName,
      `${productName} Supplier`,
      `${productName} Dealer`,
      `${productName} Distributor`,
      `${productName} Manufacturer`,
      `${productName} Price`,
      `${productName} Price in India`,
      `${productName} for Laboratory`,
      `${productName} for Hospital`,
      "Biomedical Equipment",
      "Laboratory Equipment",
      "Diagnostic Equipment",
      "Human Biomedicals",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Human Biomedicals",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          alt: productName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    metadataBase: new URL("https://humanbiomedicals.co.in"),
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return <ProductDetails slug={slug} product={product} />;
}