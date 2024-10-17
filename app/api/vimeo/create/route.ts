import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, size } = await request.json();

    const createResponse = await fetch("https://api.vimeo.com/me/videos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.vimeo.*+json;version=3.4",
      },
      body: JSON.stringify({
        upload: {
          approach: "tus",
          size: size,
        },
        name: name,
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(errorData.error || "Failed to create video on Vimeo");
    }

    const data = await createResponse.json();
    return NextResponse.json({
      upload_link: data.upload.upload_link,
      link: data.link,
    });
  } catch (error) {
    console.error("Error creating video on Vimeo:", error);
    return NextResponse.json(
      { error: "Failed to create video on Vimeo" },
      { status: 500 }
    );
  }
}
