import { NextRequest, NextResponse } from "next/server";
import { isSessionValid } from "@/lib/admin-auth";
import { Product, readProducts, writeProducts } from "@/lib/store";

export const runtime = "nodejs";
function allowed(request: NextRequest) { return isSessionValid(request.cookies.get("admin_session")?.value); }
function valid(product: Partial<Product>): product is Omit<Product, "id"> {
  return typeof product.name === "string" && typeof product.category === "string" && typeof product.price === "number" && product.price >= 0 && typeof product.unit === "string" && typeof product.image === "string" && typeof product.description === "string" && typeof product.origin === "string";
}
export async function GET(request: NextRequest) {
  if (!allowed(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await readProducts());
}
export async function POST(request: NextRequest) {
  if (!allowed(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const product = await request.json();
  if (!valid(product)) return NextResponse.json({ message: "Data produk belum lengkap." }, { status: 400 });
  const products = await readProducts();
  const newProduct = { ...product, id: Math.max(0, ...products.map((item) => item.id)) + 1 };
  products.push(newProduct);
  await writeProducts(products);
  return NextResponse.json(newProduct, { status: 201 });
}
