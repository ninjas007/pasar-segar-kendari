import { NextRequest, NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (typeof password !== "string" || !(await verifyPassword(password))) {
    return NextResponse.json({ message: "Kata sandi tidak tepat." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", createSession(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return response;
}
