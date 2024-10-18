import { NextResponse } from "next/server";
import { backendUrl } from "@/config";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const response = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      const { accessToken, user } = data.data;

      if (user.role !== "admin") {
        return NextResponse.json(
          {
            success: false,
            message: "You are not authorized to access this resource",
          },
          { status: 401 }
        );
      }

      // Create the response
      const apiResponse = NextResponse.json({ success: true, user });

      // Set the access token in an HTTP-only cookie
      apiResponse.cookies.set("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 604800, // 1 week
      });

      // Set user role in a separate cookie (not HTTP-only so it's accessible by client-side JavaScript)
      apiResponse.cookies.set("user_role", user.role, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 604800, // 1 week
      });

      return apiResponse;
    } else {
      return NextResponse.json(
        { success: false, message: data.message },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
