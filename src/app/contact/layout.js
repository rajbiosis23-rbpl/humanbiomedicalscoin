export const metadata = {
  title: "Contact Human Biomedicals | Biomedical & Lab Equipment Supplier",
  description:
    "Get in touch with Human Biomedicals for hospital, laboratory, and biomedical diagnostic equipment sales, maintenance, AMC, calibration, and support across India.",
  keywords: [
    "Contact Human Biomedicals",
    "Biomedical Equipment Supplier Jaipur",
    "Diagnostic Equipment Dealer India",
    "Hospital Equipment Supplier",
    "Biomedical AMC & Repair",
  ],
  alternates: {
    canonical: "https://humanbiomedicals.co.in/contact",
  },
  openGraph: {
    title: "Contact Human Biomedicals | Biomedical & Lab Equipment Supplier",
    description:
      "Get in touch with Human Biomedicals for hospital, laboratory, and biomedical equipment sales, calibration, AMC, and support across India.",
    url: "https://humanbiomedicals.co.in/contact",
    siteName: "Human Biomedicals",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Human Biomedicals",
    description:
      "Get in touch with Human Biomedicals for biomedical and laboratory equipment sales & support.",
  },
};

export default function ContactLayout({ children }) {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Human Biomedicals",
    url: "https://humanbiomedicals.co.in/contact",
    description:
      "Contact page for Human Biomedicals, premier supplier of hospital and laboratory diagnostic equipment.",
    mainEntity: {
      "@type": "MedicalBusiness",
      name: "Human Biomedicals",
      telephone: "+91-9251616952",
      email: "info@humanbiomedicals.co.in",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Unit S-1, 2nd Floor, Pn 16, D Block, Tagore Nagar, Vaishali Nagar",
        addressLocality: "Jaipur",
        postalCode: "302021",
        addressRegion: "Rajasthan",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "26.8952",
        longitude: "75.7453",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
      />
      {children}
    </>
  );
}
