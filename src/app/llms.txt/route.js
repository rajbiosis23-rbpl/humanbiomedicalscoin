import { NextResponse } from "next/server";
import { fetchFullCatalogData } from "@/lib/db-server";
import { adminDb } from "@/lib/firebaseAdmin";

const DOMAIN = "https://humanbiomedicals.co.in";
const WEBSITE = "humanbiomedicalscoin";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  try {
    const catalogData = await fetchFullCatalogData();
    const categories = catalogData.categoryList || [];
    const products = catalogData.categoryProducts || [];

    // Districts
    let districts = [];
    if (adminDb) {
      const districtSnap = await adminDb
        .collection("websites")
        .doc(WEBSITE)
        .collection("districts")
        .get();
      districts = districtSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    const publishedProducts = products.filter((p) => p.isPublished !== false);

    // Format Categories Text
    const categoryText =
      categories.length > 0
        ? categories
            .map((cat) => {
              const subs = cat.subcategories || [];
              const subText = subs
                .map((s) => `  - Subcategory: ${s.name || s.subCategory}`)
                .join("\n");

              return `## ${cat.name || cat.category}\n- Category Slug: ${cat.slug || cat.id}\n- Subcategories:\n${subText || "  (None)"}\n`;
            })
            .join("\n")
        : "No Categories Found";

    // Format Products Text
    const productText =
      publishedProducts.length > 0
        ? publishedProducts
            .slice(0, 100) // Keep llms.txt clean and token-friendly
            .map((p) => {
              return `### ${p.title}
Category: ${p.category} | Subcategory: ${p.subCategory}
Brand: ${p.brand || "Human Biomedicals"}
Model: ${p.model || "N/A"}
Price: ${p.price ? `₹${p.price}` : "Contact for quotation"}
Description: ${p.desc || p.description || "Biomedical instrument supplied across India."}
Instrument Type: ${p.instrument || "Diagnostic Laboratory Equipment"}
Automation: ${p.automation || "N/A"}
Usage: ${p.usage || "Clinical & Hospital Diagnostics"}
URL: ${DOMAIN}/items/${p.slug}
`;
            })
            .join("\n")
        : "No Products Found";

    // Format Districts Text
    const districtText =
      districts.length > 0
        ? districts.map((d) => `- ${DOMAIN}/${d.id}`).join("\n")
        : `- ${DOMAIN}/items`;

    const content = `# Human Biomedicals - Master Product Catalog & Services
Website: ${DOMAIN}
Last Updated: ${new Date().toISOString()}

## Catalog Summary
- Total Published Products: ${publishedProducts.length}
- Total Categories: ${categories.length}
- Total Districts Served: ${districts.length}

## About Human Biomedicals
Human Biomedicals is a premier supplier and distributor of clinical laboratory instruments, biochemistry analyzers, hematology systems, electrolyte analyzers, test strips, and pathology consumables across India.

## Services Offered
- Biomedical Equipment Sales & Distribution
- Laboratory Analyzer Installation & Setup
- Annual Maintenance Contracts (AMC / CMC)
- Calibration & Diagnostic Technical Support
- Pan-India Reagent & Consumables Delivery

------------------------------------------------
## Categories & Subcategories
${categoryText}

------------------------------------------------
## Featured Biomedical Products
${productText}

------------------------------------------------
## District Locations
${districtText}

------------------------------------------------
## Links & Resources
- Catalog: ${DOMAIN}/items
- XML Sitemap: ${DOMAIN}/sitemap.xml
- Robots Policy: ${DOMAIN}/robots.txt
- Contact & Quotes: ${DOMAIN}/contact
`;

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    console.error("llms.txt error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}