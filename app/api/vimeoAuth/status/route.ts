import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/config";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(
      `${backendUrl}/vimeoAuth/status?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.message || "Failed to check Vimeo auth status");
    }

    const result = await backendResponse.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking Vimeo auth status:", error);
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
