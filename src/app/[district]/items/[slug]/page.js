import ProductDetailsPage from "@/components/ProductDetailsPage";

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