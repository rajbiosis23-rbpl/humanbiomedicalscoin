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
      "Human Biomedicals Diagnostic Equipment Products",
    template: "%s | Human Biomedicals",
  },

  description:
    "Human Biomedicals provides premium biomedical products, laboratory solutions, diagnostic equipment and healthcare innovations.",

  keywords: [
    "Biomedical Products India",
    "Healthcare Equipment",
    "Laboratory Equipment",
    "Diagnostic Solutions",
    "Medical Devices India",
    "Human Biomedicals Diagnostic Equipment"
  ],

  openGraph: {
    title:
      "Human Biomedicals Diagnostic Equipment Products",

    description:
      "Premium biomedical products and healthcare innovations.",

    url:
      "https://www.rajbiosis.com",

    siteName: "RajBiosis",

    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Human Biomedicals Diagnostic Equipment Products",

    description:
      "Premium biomedical solutions.",

    images: [
      "/og-image.jpg"
    ],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical:
      "https://www.rajbiosis.com",
  },
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
