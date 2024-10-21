import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/config";

export async function GET(request: NextRequest) {
  try {
    // Redirect the user to the backend's Vimeo OAuth route
    const vimeoAuthUrl = `${backendUrl}/vimeoAuth`;

    // Create a response that redirects to the backend URL
    return NextResponse.redirect(vimeoAuthUrl);
  } catch (error) {
    console.error("Error initiating Vimeo OAuth:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to initiate Vimeo OAuth",
      },
      { status: 500 }
    );
  }
}
