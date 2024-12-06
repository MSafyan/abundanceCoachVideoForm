import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/app/utils/auth";
import { backendUrl } from "@/config";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = checkAuth();

  if (typeof authResult !== "string") {
    return authResult;
  }

  const accessToken = authResult;

  try {
    const response = await fetch(`${backendUrl}/videos/${params.id}`, {
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
        { success: false, message: data.message || "Failed to fetch video" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching the video" },
      { status: 500 }
    );
  }
}
