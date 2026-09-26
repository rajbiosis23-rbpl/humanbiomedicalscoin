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
export const revalidate = 0;

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
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }

    if (type === "contact") {
      const contactInfo = await getContactData();
      return NextResponse.json(
        { success: true, type: "contact", websiteId, data: { contactInfo }, contactInfo },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }

    if (type === "services") {
      const services = await getServicesData();
      return NextResponse.json(
        { success: true, type: "services", websiteId, data: { services }, services },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }

    if (type === "districts") {
      if (district) {
        const districtData = await getDistrictData(district);
        return NextResponse.json(
          { success: true, type: "district", websiteId, district, data: districtData },
          { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
        );
      }
      const districts = await getDistrictsList();
      return NextResponse.json(
        { success: true, type: "districts", websiteId, data: districts, districts },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }

    // Default: fetch from SQLite Admin API
    const adminRes = await fetchSiteDataFromAdmin(websiteId, type);
    return NextResponse.json(adminRes, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (error) {
    console.error("API /api/site-data error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
