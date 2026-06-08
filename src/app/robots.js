export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],

    sitemap:
      "https://humanbiomedicals.co.in/sitemap.xml",
  };
}