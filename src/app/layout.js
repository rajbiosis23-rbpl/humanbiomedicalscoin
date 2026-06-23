import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ScrollProgress from "@/components/common/ScrollProgress";
import FloatingCTA from "@/components/common/FloatingCTA";


export const metadata = {
  metadataBase: new URL(
    "https://www.rajbiosis.com"
  ),

  title: {
    default:
      "Raj Biosis | Biomedical, Laboratory & Diagnostic Equipment Supplier India",
    template:
      "%s | Raj Biosis",
  },

  description:
    "Raj Biosis is a trusted supplier of biomedical equipment, laboratory instruments, diagnostic systems, pathology analyzers and healthcare solutions across India.",

  keywords: [
    "Biomedical Equipment India",
    "Laboratory Equipment Supplier",
    "Diagnostic Equipment",
    "Pathology Analyzer",
    "Hospital Equipment",
    "Medical Devices India",
    "Healthcare Solutions",
    "Raj Biosis",
  ],

  authors: [
    {
      name: "Raj Biosis",
    },
  ],

  creator: "Raj Biosis",
  publisher: "Raj Biosis",

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
      "https://www.rajbiosis.com",
  },

  openGraph: {
    title:
      "Raj Biosis | Biomedical & Diagnostic Equipment Supplier",

    description:
      "Premium biomedical products, laboratory instruments, diagnostic analyzers and healthcare solutions across India.",

    url:
      "https://www.rajbiosis.com",

    siteName:
      "Raj Biosis",

    locale:
      "en_IN",

    type:
      "website",

    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Raj Biosis",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Raj Biosis | Biomedical Equipment Supplier",

    description:
      "Trusted supplier of biomedical, laboratory and diagnostic equipment in India.",

    images: [
      "/images/logo.png",
    ],
  },

  category:
    "Medical Equipment",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">

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
