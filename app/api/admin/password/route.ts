import { NextRequest, NextResponse } from "next/server";
import { changePassword, isSessionValid, verifyPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";
export async function PATCH(request: NextRequest) {
  if (!isSessionValid(request.cookies.get("admin_session")?.value)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { currentPassword, newPassword } = await request.json();
  if (typeof newPassword !== "string" || newPassword.length < 8) return NextResponse.json({ message: "Kata sandi baru minimal 8 karakter." }, { status: 400 });
  if (typeof currentPassword !== "string" || !(await verifyPassword(currentPassword))) return NextResponse.json({ message: "Kata sandi saat ini tidak tepat." }, { status: 400 });
  await changePassword(newPassword);
  return NextResponse.json({ ok: true });
}
