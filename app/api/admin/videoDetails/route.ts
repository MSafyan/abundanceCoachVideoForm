import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/config";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    const response = await fetch(`${backendUrl}/videoDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (data.success) {
      const result = data.data;

      return NextResponse.json({
        success: true,
        message: "Video details submitted successfully",
        data: result,
      });
    } else {
      console.log("data", data);
      return NextResponse.json(
        { success: false, message: data.message },
        { status: 400 }
      );
    }
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
