import ProductDetails from "./ProductDetails";
import { fetchFullCatalog, getProductBySlug } from "@/lib/data-fetcher-server";

export const revalidate = 60;

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

  const productUrl = `https://humanbiomedicals.co.in/items/${slug}`;
  const productImages = product?.images?.length
    ? product.images
    : product?.image
    ? [product.image]
    : ["https://humanbiomedicals.co.in/images/logo.png"];

  const productSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        image: productImages,
        description: product.desc || product.description || product.title,
        sku: product.slug || product.id,
        mpn: product.model || product.slug,
        category: product.category || "Biomedical Equipment",
        brand: {
          "@type": "Brand",
          name: product.brand || "Human Biomedicals",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: product.price ? String(product.price).replace(/[^0-9.]/g, "") || "1" : "1",
          availability: "https://schema.org/InStock",
          url: productUrl,
          seller: {
            "@type": "Organization",
            name: "Human Biomedicals",
          },
        },
      }
    : null;

  const breadcrumbSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://humanbiomedicals.co.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: "https://humanbiomedicals.co.in/items",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.title,
            item: productUrl,
          },
        ],
      }
    : null;

  const faqSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is ${product.title} used for?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${product.title} is used in hospitals, pathology labs, diagnostic centres, and healthcare facilities.`,
            },
          },
          {
            "@type": "Question",
            name: "Do you provide quotation and delivery support in India?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, Human Biomedicals provides fast delivery, official quotation, and technical support across all districts in India.",
            },
          },
        ],
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ProductDetails slug={slug} product={product} />
    </>
  );
}