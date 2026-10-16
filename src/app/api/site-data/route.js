import { NextResponse } from "next/server";
import {
  getHomeData,
  getContactData,
  getServicesData,
  getDistrictData,
  getDistrictsList,
  WEBSITE_ID,
} from "@/lib/db-server";
import { fetchSiteDataFromAdmin } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || searchParams.get("page") || "all";
    const district = searchParams.get("district") || searchParams.get("slug");
    const websiteId = searchParams.get("websiteId") || WEBSITE_ID;

    if (type === "home") {
      const data = await getHomeData();
      return NextResponse.json(
        { success: true, type: "home", websiteId, data },
        { headers: CACHE_HEADERS }
      );
    }

    if (type === "contact") {
      const contactInfo = await getContactData();
      return NextResponse.json(
        { success: true, type: "contact", websiteId, data: { contactInfo }, contactInfo },
        { headers: CACHE_HEADERS }
      );
    }

    if (type === "services") {
      const services = await getServicesData();
      return NextResponse.json(
        { success: true, type: "services", websiteId, data: { services }, services },
        { headers: CACHE_HEADERS }
      );
    }

    if (type === "districts") {
      if (district) {
        const districtData = await getDistrictData(district);
        return NextResponse.json(
          { success: true, type: "district", websiteId, district, data: districtData },
          { headers: CACHE_HEADERS }
        );
      }
      const districts = await getDistrictsList();
      return NextResponse.json(
        { success: true, type: "districts", websiteId, data: districts, districts },
        { headers: CACHE_HEADERS }
      );
    }

    // Default: fetch from SuperAdmin / MongoDB
    const adminRes = await fetchSiteDataFromAdmin(websiteId, type);
    return NextResponse.json(adminRes, {
      headers: CACHE_HEADERS,
    });
  } catch (error) {
    console.error("API /api/site-data error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
