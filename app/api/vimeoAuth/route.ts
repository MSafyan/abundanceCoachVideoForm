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

    // Get the host from the request
    const host = request.headers.get("host");
    const protocol =
      process.env.NEXT_PUBLIC_APP_ENV === "development" ? "http" : "https";

    // Create the callback URL
    const redirectUri = `${protocol}://${host}/vimeoCallback`;

    // Redirect the user to the backend's Vimeo OAuth route with userId and callbackUrl
    const vimeoAuthUrl = `${backendUrl}/vimeoAuth?userId=${userId}&redirectUri=${encodeURIComponent(
      redirectUri
    )}`;

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
