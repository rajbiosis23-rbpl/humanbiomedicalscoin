import ProductDetailsPage from "@/components/ProductDetailsPage";

export async function generateMetadata({
    params,
}) {

    const { slug, district } =
        await params;

    const city =
        district
            ?.replace(/-/g, " ")
            ?.replace(
                /\b\w/g,
                (c) => c.toUpperCase()
            );

    const productName =
        slug
            ?.replace(/-/g, " ")
            ?.replace(
                /\b\w/g,
                (c) => c.toUpperCase()
            );

    const title =
        `${productName} Supplier in ${city} | Raj Biosis`;

    const description =
        `Buy ${productName} in ${city} from Raj Biosis. Trusted supplier of biomedical equipment, laboratory instruments, diagnostic systems and pathology analyzers.`;

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
            "Raj Biosis",
        ],

        robots: {
            index: true,
            follow: true,
        },

        alternates: {
            canonical:
                `https://humanbiomedicals.co.in/${district}/products/${slug}`,
        },

        openGraph: {
            title,
            description,

            url:
                `https://humanbiomedicals.co.in/${district}/products/${slug}`,

            siteName:
                "Raj Biosis",

            locale:
                "en_IN",

            type:
                "website",
        },

        twitter: {
            card:
                "summary_large_image",

            title,
            description,
        },
    };
}

export default async function Page({
    params,
}) {

    const { slug, district } =
        await params;

    return (
        <ProductDetailsPage
            slug={slug}
            district={district}
        />
    );
}