import { fetchFullCatalog } from "@/lib/db-server";
import { adminDb } from "@/lib/firebaseAdmin";

export default async function sitemap() {
  const BASE_URL = "https://humanbiomedicals.co.in";
  let urls = [];

  try {
    // 1. Fetch products from Master Catalog
    const products = await fetchFullCatalog();

    // 2. Fetch districts
    let districts = [];
    if (adminDb) {
      const districtSnap = await adminDb
        .collection("websites")
        .doc("humanbiomedicalscoin")
        .collection("districts")
        .get();
      districts = districtSnap.docs.map((doc) => doc.id);
    }

    // 3. Static Root Pages
    urls.push(
      { url: `${BASE_URL}`, priority: 1.0, lastModified: new Date() },
      { url: `${BASE_URL}/about`, priority: 0.8, lastModified: new Date() },
      { url: `${BASE_URL}/contact`, priority: 0.8, lastModified: new Date() },
      { url: `${BASE_URL}/services`, priority: 0.8, lastModified: new Date() },
      { url: `${BASE_URL}/items`, priority: 0.9, lastModified: new Date() }
    );

    // 4. Product Pages
    for (const product of products) {
      if (product.isPublished === false) continue;
      const slug = product.slug;
      if (!slug) continue;

      urls.push({
        url: `${BASE_URL}/items/${slug}`,
        lastModified: new Date(),
        priority: 0.9,
      });

      // District + Product URLs
      for (const district of districts) {
        urls.push({
          url: `${BASE_URL}/${district}/items/${slug}`,
          lastModified: new Date(),
          priority: 0.8,
        });
      }
    }

    // 5. District Pages
    districts.forEach((district) => {
      urls.push(
        { url: `${BASE_URL}/${district}`, priority: 0.85, lastModified: new Date() },
        { url: `${BASE_URL}/${district}/about`, priority: 0.7, lastModified: new Date() },
        { url: `${BASE_URL}/${district}/contact`, priority: 0.7, lastModified: new Date() },
        { url: `${BASE_URL}/${district}/services`, priority: 0.7, lastModified: new Date() },
        { url: `${BASE_URL}/${district}/items`, priority: 0.8, lastModified: new Date() }
      );
    });

    return urls;
  } catch (err) {
    console.error("Sitemap Generation Error:", err);
    return [];
  }
}