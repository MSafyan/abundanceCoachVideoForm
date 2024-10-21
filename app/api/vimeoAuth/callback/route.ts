import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/config";

export async function POST(request: NextRequest) {
  try {
    // Handle the OAuth callback from Vimeo
    const body = await request.json();

    const backendResponse = await fetch(`${backendUrl}/vimeoAuth/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.message || "Failed to complete Vimeo OAuth");
    }

    const result = await backendResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error completing Vimeo OAuth:", error);
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
