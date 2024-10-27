import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/config";

export async function GET(request: NextRequest) {
  try {
    // Handle the OAuth callback from Vimeo
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    // Get the host from the request
    const host = request.headers.get("host");
    const protocol =
      process.env.NEXT_PUBLIC_APP_ENV === "development" ? "http" : "https";

    // Create the callback URL
    const redirectUri = `${protocol}://${host}/vimeoCallback`;

    const backendResponse = await fetch(
      `${backendUrl}/vimeoAuth/callback?code=${code}&state=${state}&redirectUri=${redirectUri}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.message || "Failed to complete Vimeo OAuth");
    }

    const result = await backendResponse.json();

    // Redirect to the form page with a success parameter
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error completing Vimeo OAuth:", error);
    // Redirect to the form page with an error parameter
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
