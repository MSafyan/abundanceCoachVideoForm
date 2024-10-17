import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/app/utils/auth";

export async function GET(request: NextRequest) {
  const authResult = checkAuth();

  if (typeof authResult !== "string") {
    return authResult;
  }

  const accessToken = authResult;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/videos`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch videos" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching videos" },
      { status: 500 }
    );
  }
}
