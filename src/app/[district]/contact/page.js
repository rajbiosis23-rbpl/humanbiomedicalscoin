import Contact from "@/app/contact/page";
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
    title: `Contact Human Biomedical in ${city} | Biomedical Equipment Supplier`,

    description: `Contact Human Biomedical in ${city} for biomedical equipment sales, installation, AMC, calibration, repair and support services. Get a quick response from our team.`,

    keywords: [
      `Contact Human Biomedical ${city}`,
      `Biomedical Equipment Supplier ${city}`,
      `Biomedical Service ${city}`,
      `Medical Equipment Dealer ${city}`,
      `Lab Equipment Supplier ${city}`,
      `Hospital Equipment ${city}`,
      `Diagnostic Equipment ${city}`,
      `Biomedical AMC ${city}`,
      `Biomedical Repair Service ${city}`,
      `Biomedical Calibration ${city}`,
    ],

    alternates: {
      canonical: `https://humanbiomedicals.co.in/${district}/contact`,
    },

    openGraph: {
      title: `Contact Human Biomedical in ${city}`,
      description:
        `Get in touch with Human Biomedical for equipment sales and support in ${city}.`,
      url: `https://humanbiomedicals.co.in/${district}/contact`,
      siteName: "Human Biomedical",
      type: "website",
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

// FIREBASE SE DISTRICT
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
    <Contact city={city} />
  );
}