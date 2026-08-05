import { adminDb } from "@/lib/firebaseAdmin";

export default async function sitemap() {
  const BASE_URL =
    "https://humanbiomedicals.co.in";

  let urls = [];

  try {
    // districts fetch
    const districtSnap =
      await adminDb
        .collection(
          "websites"
        )
        .doc(
          "humanbiomedicalscoin"
        )
        .collection("districts")
        .get();

    const districts =
      districtSnap.docs.map(
        (doc) => doc.id
      );

    // products fetch
    const productDoc =
      await adminDb
        .collection(
          "websites"
        )
        .doc(
          "humanbiomedicalscoin"
        )
        .collection("pages")
        .doc("products")
        .get();

    const products =
      productDoc.data()
        ?.products || [];

    // district + product urls
    for (const district of districts) {
      for (const product of products) {
        if (
          product.isPublished ===
          false
        )
          continue;

        const slug =
          product.title
            ?.toLowerCase()
            .trim()
            .replace(
              /[^a-z0-9\s-]/g,
              ""
            )
            .replace(
              /\s+/g,
              "-"
            );

        urls.push({
          url: `${BASE_URL}/${district}/items/${slug}`,

          lastModified:
            new Date(),

          priority: 0.9,
        });
      }
    }

    // static urls
    districts.forEach(
      (district) => {
        urls.push(
          {
            url: `${BASE_URL}/${district}`,

            priority: 1,
          },
          {
            url: `${BASE_URL}/${district}/about`,
          },
          {
            url: `${BASE_URL}/${district}/contact`,
          },
          {
            url: `${BASE_URL}/${district}/services`,
          },
          {
            url: `${BASE_URL}/${district}/items`,
          }
        );
      }
    );

    return urls;
  } catch (err) {
    console.error(
      "Sitemap Error:",
      err
    );

    return [];
  }
}