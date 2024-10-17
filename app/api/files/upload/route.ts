import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const signedUrl = searchParams.get("signedUrl");

    if (!signedUrl) {
      return NextResponse.json(
        { success: false, message: "No signed URL provided" },
        { status: 400 }
      );
    }

    const file = await request.blob();

    const uploadResponse = await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file");
    }

    const baseUrl = new URL(signedUrl);
    const fileUrl = `${baseUrl.origin}${baseUrl.pathname}`;

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: { fileUrl },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
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
