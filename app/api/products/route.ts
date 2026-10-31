import { NextResponse } from "next/server";
import { readProducts } from "@/lib/store";

export const runtime = "nodejs";
export async function GET() {
  return NextResponse.json(await readProducts());
}
