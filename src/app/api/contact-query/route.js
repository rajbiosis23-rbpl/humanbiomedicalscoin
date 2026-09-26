import { NextResponse } from "next/server";
import { submitContactQuery } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, city } = body || {};

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

    if (!phone || !/^\d{10}$/.test(String(phone).replace(/\D/g, ""))) {
      return NextResponse.json(
        { success: false, error: "Phone number must be exactly 10 digits" },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const result = await submitContactQuery({
      name: name.trim(),
      email: email.trim(),
      phone: String(phone).trim(),
      message: message.trim(),
      city: city || "India",
    });

    return NextResponse.json(
      {
        success: true,
        message: result.message || "Contact enquiry received successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API /api/contact-query error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit contact query" },
      { status: 500 }
    );
  }
}
