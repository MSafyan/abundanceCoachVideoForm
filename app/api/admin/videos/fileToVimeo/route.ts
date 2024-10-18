import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/config";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const video = formData.get("video") as File;
    console.log("3");
    console.log(video);

    if (!video) {
      return NextResponse.json(
        { success: false, message: "No video file provided" },
        { status: 400 }
      );
    }

    console.log("4");

    const backendResponse = await fetch(`${backendUrl}/videos/fileToVimeo`, {
      method: "POST",
      body: formData,
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.message || "Failed to upload video");
    }

    const result = await backendResponse.json();

    return NextResponse.json({
      success: true,
      message: "Video uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
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
