import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/config";
import { cookies } from "next/headers";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const accessToken = cookies().get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.json();
    const response = await fetch(`${backendUrl}/videos/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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
