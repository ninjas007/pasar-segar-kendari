import { createClient } from "redis";

let connection: ReturnType<typeof createClient> | undefined;

export async function redis() {
  if (!connection) {
    const url = process.env.STORAGE_URL || process.env.REDIS_URL;
    if (!url) throw new Error("Redis belum terhubung. Variabel STORAGE_URL tidak ditemukan.");
    connection = createClient({ url });
    connection.on("error", (error) => console.error("Redis error:", error));
    await connection.connect();
  }
  return connection!;
}
