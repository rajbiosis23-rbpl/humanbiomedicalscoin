import { NextResponse } from "next/server";
import { fetchFullCatalog } from "@/lib/db-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const search = searchParams.get("search");

    let products = await fetchFullCatalog();

    if (category) {
      const catLower = category.toLowerCase();
      products = products.filter(
        (p) => (p.category || "").toLowerCase() === catLower || (p.categoryId || "").toLowerCase() === catLower
      );
    }

    if (subcategory) {
      const subLower = subcategory.toLowerCase();
      products = products.filter(
        (p) => (p.subCategory || "").toLowerCase() === subLower || (p.subcategoryId || "").toLowerCase() === subLower
      );
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.desc || "").toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q) ||
          (p.model || "").toLowerCase().includes(q)
      );
    }

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        products,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("API /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
