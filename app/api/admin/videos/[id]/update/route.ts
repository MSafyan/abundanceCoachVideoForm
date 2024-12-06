import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/config";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.json();
    const response = await fetch(`${backendUrl}/videos/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (data.success) {
      return NextResponse.json({
        success: true,
        message: "Video details updated successfully",
        data: data.data,
      });
    } else {
      return NextResponse.json(
        { success: false, message: data.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating video details:", error);
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
