import ProductDetailsPage from "@/components/ProductDetailsPage";

export default async function Page({
    params,
}) {

    const { slug } = await params;

    return (
        <ProductDetailsPage
            slug={slug}
        />
    );
}