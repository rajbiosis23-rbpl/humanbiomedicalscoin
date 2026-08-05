import AboutPage from "@/app/about/page";
import { fetchDistrictsList } from "@/lib/data-fetcher";

// SEO
export async function generateMetadata({
  params,
}) {

  const { district } =
    await params;

  const city = district
    ?.replace(/-/g, " ")
    ?.replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    );

  return {
    title: `About Human Biomedical in ${city} | Biomedical Equipment Supplier`,

    description: `Human Biomedical provides biomedical equipment sales, service, installation, calibration and support in ${city}. Trusted supplier for hospitals, laboratories and diagnostic centres.`,

    keywords: [
      `Biomedical Equipment in ${city}`,
      `Lab Equipment in ${city}`,
      `Diagnostic Equipment in ${city}`,
      `Hospital Equipment Supplier ${city}`,
      `Biomedical Service ${city}`,
      `Human Biomedical ${city}`,
      `Medical Equipment Dealer ${city}`,
      `Pathology Lab Equipment ${city}`,
      `Diagnostic Centre Equipment ${city}`,
    ],

    alternates: {
      canonical: `https://humanbiomedicals.co.in/${district}/about`,
    },

    openGraph: {
      title: `About Human Biomedical in ${city}`,
      description:
        `Biomedical equipment supplier and service provider in ${city}.`,
      url: `https://humanbiomedicals.co.in/${district}/about`,
      siteName: "Human Biomedical",
      type: "website",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

// DYNAMIC DISTRICTS
export async function generateStaticParams() {
  try {
    const districts = await fetchDistrictsList();
    return districts.map((district) => ({
      district,
    }));
  } catch (error) {
    console.error(
      "District fetch error:",
      error
    );

    return [];
  }
}

export default async function Page({
  params,
}) {

  const resolvedParams =
    await params;

  const district =
    resolvedParams?.district || "";

  const city = district
    .replace(/-/g, " ")
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );

  return (
    <AboutPage city={city} />
  );
}