import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function checkAuth() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token");

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  return accessToken.value;
}
