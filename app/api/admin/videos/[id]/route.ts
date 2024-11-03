import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendUrl } from "@/config";
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const accessToken = cookies().get("access_token")?.value;
  const { isVerified } = await request.json();

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${backendUrl}/videos/${params.id}/admin`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ isVerified }),
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true, data: data.data });
    } else {
      return NextResponse.json(
        { success: false, message: data.message },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error updating video status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating the video status",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
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
    const response = await fetch(`${backendUrl}/videos/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({ success: true, data: data.data });
    } else {
      return NextResponse.json(
        { success: false, message: data.message },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while deleting the video",
      },
      { status: 500 }
    );
  }
}
