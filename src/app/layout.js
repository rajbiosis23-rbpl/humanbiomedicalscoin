import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ScrollProgress from "@/components/common/ScrollProgress";
import FloatingCTA from "@/components/common/FloatingCTA";


export const metadata = {
  metadataBase: new URL(
    "https://www.humanbiomedicals.co.in"
  ),

  title: {
    default:
      "Human Biomedicals | Biomedical, Laboratory & Diagnostic Equipment Supplier India",
    template:
      "%s | Human Biomedicals",
  },

  description:
    "Human Biomedicals  is a trusted supplier of biomedical equipment, laboratory instruments, diagnostic systems, pathology analyzers and healthcare solutions across India.",

  keywords: [
    "Biomedical Equipment India",
    "Laboratory Equipment Supplier",
    "Diagnostic Equipment",
    "Pathology Analyzer",
    "Hospital Equipment",
    "Medical Devices India",
    "Healthcare Solutions",
    "Human Biomedicals ",
  ],

  authors: [
    {
      name: "Human Biomedicals ",
    },
  ],

  creator: "Human Biomedicals ",
  publisher: "Human Biomedicals ",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical:
      "https://www.humanbiomedicals.co.in",
  },

  openGraph: {
    title:
      "Human Biomedicals  | Biomedical & Diagnostic Equipment Supplier",

    description:
      "Premium biomedical products, laboratory instruments, diagnostic analyzers and healthcare solutions across India.",

    url:
      "https://www.humanbiomedicals.co.in",

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
        alt: "Human Biomedicals ",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Human Biomedicals  | Biomedical Equipment Supplier",

    description:
      "Trusted supplier of biomedical, laboratory and diagnostic equipment in India.",

    images: [
      "/images/logo.png",
    ],
  },

  category:
    "Medical Equipment",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Human Biomedicals",
  url: "https://humanbiomedicals.co.in",
  logo: "https://humanbiomedicals.co.in/images/logo.png",
  image: "https://humanbiomedicals.co.in/images/logo.png",
  description:
    "Human Biomedicals is a trusted supplier of biomedical equipment, clinical laboratory instruments, diagnostic systems, pathology analyzers, and healthcare solutions across India.",
  telephone: "+91-9828000000",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Medical Equipment Zone",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    postalCode: "302001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "26.9124",
    longitude: "75.7873",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  priceRange: "₹₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Bank Transfer, Credit Card, Cheque, Online",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Human Biomedicals",
  url: "https://humanbiomedicals.co.in",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://humanbiomedicals.co.in/items?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>

      <body className="min-h-screen bg-[#fff8f2] text-[#1b1b1b]">

        <ScrollProgress />

        <div className="relative flex flex-col min-h-screen">

          <Navbar />

          <main className="flex-1 pt-[110px]">

            {children}

          </main>

          <Footer />

        </div>

        <FloatingCTA />

      </body>

    </html>
  );
}
