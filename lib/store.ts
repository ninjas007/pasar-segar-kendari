import { promises as fs } from "fs";
import path from "path";

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

const dataDirectory = path.join(process.cwd(), "data");
const productsFile = path.join(dataDirectory, "products.json");

export async function readProducts(): Promise<Product[]> {
  const contents = await fs.readFile(productsFile, "utf8");
  return JSON.parse(contents) as Product[];
}

export async function writeProducts(products: Product[]) {
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(productsFile, `${JSON.stringify(products, null, 2)}\n`, "utf8");
}
