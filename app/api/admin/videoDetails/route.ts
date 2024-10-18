import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/config";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    const backendResponse = await fetch(`${backendUrl}/videoDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.message || "Failed to submit video details");
    }

    const result = await backendResponse.json();

    return NextResponse.json({
      success: true,
      message: "Video details submitted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error submitting video details:", error);
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
