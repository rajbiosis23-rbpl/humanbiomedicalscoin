import { NextResponse } from "next/server";
import { fetchFullCatalogData } from "@/lib/db-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await fetchFullCatalogData();
    return NextResponse.json(
      {
        success: true,
        count: data.categoryProducts.length,
        categoryList: data.categoryList,
        products: data.categoryProducts,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("API /api/catalog error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
