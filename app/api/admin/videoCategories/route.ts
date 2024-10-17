import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/app/utils/auth";

export async function GET(request: NextRequest) {
  try {
    const backendResponse = await fetch(
      `${process.env.BACKEND_URL}/videoCategories`,
      {
        method: "GET",
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.message || "Failed to fetch video categories");
    }

    const result = await backendResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching video categories:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
