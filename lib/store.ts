import { Redis } from "@upstash/redis";
import initialProducts from "@/data/products.json";

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

function redis() {
  if (!process.env.KV_REST_API_URL && !process.env.UPSTASH_REDIS_REST_URL) {
    throw new Error("Upstash Redis belum terhubung. Tambahkan integrasi Upstash ke proyek Vercel.");
  }
  return Redis.fromEnv();
}

export async function readProducts(): Promise<Product[]> {
  const database = redis();
  const products = await database.get<Product[]>(productsKey);
  if (products) return products;
  const seed = initialProducts as Product[];
  await database.set(productsKey, seed);
  return seed;
}

export async function writeProducts(products: Product[]) {
  await redis().set(productsKey, products);
}
