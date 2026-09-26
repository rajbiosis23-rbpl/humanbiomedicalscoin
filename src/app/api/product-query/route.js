import { NextResponse } from "next/server";
import { submitProductQuery } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, productName, productSlug, brand, model, city } = body || {};

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "A valid email is required" },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone || "").replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: "Valid 10-digit mobile number is required" },
        { status: 400 }
      );
    }

    const result = await submitProductQuery({
      name: name.trim(),
      email: email.trim(),
      phone: cleanPhone,
      productName: productName || "",
      productSlug: productSlug || "",
      brand: brand || "",
      model: model || "",
      city: city || "India",
    });

    return NextResponse.json(
      {
        success: true,
        message: result.message || "Product enquiry received successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API /api/product-query error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit product query" },
      { status: 500 }
    );
  }
}
