import initialProducts from "@/data/products.json";
import { redis } from "@/lib/redis";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  altUnit?: string;
  image: string;
  badge?: string;
  description: string;
  origin: string;
};

const productsKey = "pasar-segar:products";

export async function readProducts(): Promise<Product[]> {
  const database = await redis();
  const stored = await database.get(productsKey);
  if (stored) return JSON.parse(stored) as Product[];
  const seed = initialProducts as Product[];
  await database.set(productsKey, JSON.stringify(seed));
  return seed;
}

export async function writeProducts(products: Product[]) {
  await (await redis()).set(productsKey, JSON.stringify(products));
}
