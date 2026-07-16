import ProductDetailsPage from "@/components/ProductDetailsPage";

export async function generateMetadata({
    params,
}) {

    const { slug } =
        await params;

    const productName =
        slug
            .replace(/-/g, " ")
            .replace(
                /\b\w/g,
                (c) => c.toUpperCase()
            );

    const title =
        `${productName} | Biomedical Equipment Supplier India`;

    const description =
        `Buy ${productName} from Human Biomedicals . Trusted supplier of biomedical equipment, laboratory instruments, pathology analyzers and healthcare solutions across India.`;

    return {
        title,
        description,

        keywords: [
            productName,
            `${productName} Supplier`,
            `${productName} Price`,
            `${productName} India`,
            "Biomedical Equipment",
            "Laboratory Equipment",
            "Diagnostic Equipment",
            "Pathology Analyzer",
            "Human Biomedicals ",
        ],

        robots: {
            index: true,
            follow: true,
        },

        alternates: {
            canonical:
                `https://humanbiomedicals.co.in/products/${slug}`,
        },

        openGraph: {
            title,
            description,

            url:
                `https://humanbiomedicals.co.in/products/${slug}`,

            siteName:
                "Human Biomedicals ",

            locale:
                "en_IN",

            type:
                "website",

            images: [
                {
                    url: "/images/logo.png",
                    width: 1200,
                    height: 630,
                    alt: productName,
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
    };
}

export default async function Page({
    params,
}) {

    const { slug } =
        await params;

    return (
        <ProductDetailsPage
            slug={slug}
        />
    );
}