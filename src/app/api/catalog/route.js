import { NextResponse } from "next/server";
import { fetchFullCatalogData } from "@/lib/db-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchFullCatalogData();
    return NextResponse.json(
      {
        success: true,
        count: (data.categoryProducts || []).length,
        categoryList: data.categoryList || [],
        products: data.categoryProducts || [],
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
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
