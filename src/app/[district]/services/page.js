import Services from "@/app/services/page";
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
    title: `Biomedical Equipment Services in ${city} | Human Biomedical`,

    description: `Professional biomedical equipment services in ${city} including installation, maintenance, AMC, calibration, repair and technical support for hospitals, laboratories and diagnostic centres.`,

    keywords: [
      `Biomedical Equipment Services ${city}`,
      `Biomedical Equipment Repair ${city}`,
      `Biomedical AMC ${city}`,
      `Biomedical Calibration ${city}`,
      `Medical Equipment Service ${city}`,
      `Lab Equipment Service ${city}`,
      `Diagnostic Equipment Repair ${city}`,
      `Hospital Equipment Maintenance ${city}`,
      `Biomedical Engineer ${city}`,
      `Human Biomedical Services ${city}`,
    ],

    alternates: {
      canonical: `https://humanbiomedicals.co.in/${district}/services`,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

// DYNAMIC DISTRICTS (On-demand rendering for fast builds)
export async function generateStaticParams() {
  return [];
}

export default async function DistrictServicesPage({
  params,
}) {

  const { district } =
    await params;

  const city = district
    ?.replace(/-/g, " ")
    ?.replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );

  return (
    <Services city={city} />
  );
}