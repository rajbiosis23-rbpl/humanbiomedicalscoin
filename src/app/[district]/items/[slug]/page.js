import ProductDetails from "@/app/items/[slug]/ProductDetails";
import { getProductBySlug } from "@/lib/data-fetcher-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug, district } = await params;
  const product = await getProductBySlug(slug);

  const city = district
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase()) || "India";

  const productName = product?.title || slug
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase());

  const brand = product?.brand || "Human Biomedicals";
  const title = `${productName} Supplier in ${city} | ${brand}`;
  const description = product?.desc
    ? `${product.desc.slice(0, 150)}... Buy ${productName} in ${city} from ${brand}. Trusted supplier of biomedical equipment.`
    : `Buy ${productName} in ${city} from Human Biomedicals. Trusted supplier of biomedical equipment, laboratory instruments, diagnostic systems and pathology analyzers.`;

  const url = `https://humanbiomedicals.co.in/${district}/items/${slug}`;
  const imageUrl = product?.images?.[0] || product?.image || "/images/logo.png";

  return {
    title,
    description,
    keywords: [
      productName,
      `${productName} ${city}`,
      `${productName} Supplier in ${city}`,
      `${productName} Dealer in ${city}`,
      `${productName} Price in ${city}`,
      `Biomedical Equipment ${city}`,
      `Laboratory Equipment ${city}`,
      `Diagnostic Equipment ${city}`,
      "Human Biomedicals",
    ],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Human Biomedicals",
      locale: "en_IN",
      type: "website",
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
    metadataBase: new URL("https://humanbiomedicals.co.in"),
  };
}

export default async function Page({ params }) {
  const { slug, district } = await params;
  const product = await getProductBySlug(slug);

  return (
    <ProductDetails
      slug={slug}
      district={district}
      product={product}
    />
  );
}