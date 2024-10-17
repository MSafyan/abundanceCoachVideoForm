import { NextResponse } from "next/server";
import { checkAuth } from "@/app/utils/auth";

export async function GET() {
  const authResult = checkAuth();

  if (typeof authResult === "string") {
    return NextResponse.json({ authenticated: true });
  } else {
    return authResult;
  }
}
