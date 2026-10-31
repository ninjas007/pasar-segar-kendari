import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";
const dataDirectory = path.join(process.cwd(), "data");
const adminFile = path.join(dataDirectory, "admin.json");
const secret = process.env.ADMIN_SESSION_SECRET || "pasar-segar-ganti-rahasia-produksi";
type AdminRecord = { salt: string; hash: string };

async function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

async function getAdmin(): Promise<AdminRecord> {
  try {
    return JSON.parse(await fs.readFile(adminFile, "utf8")) as AdminRecord;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const salt = crypto.randomBytes(16).toString("hex");
    const record = { salt, hash: await hashPassword("admin123!@#", salt) };
    await fs.mkdir(dataDirectory, { recursive: true });
    await fs.writeFile(adminFile, `${JSON.stringify(record, null, 2)}\n`);
    return record;
  }
}

export async function verifyPassword(password: string) {
  const admin = await getAdmin();
  const hash = await hashPassword(password, admin.salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(admin.hash));
}

export async function changePassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(adminFile, `${JSON.stringify({ salt, hash: await hashPassword(password, salt) }, null, 2)}\n`);
}

export function createSession() {
  const payload = Buffer.from(JSON.stringify({ admin: true, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function isSessionValid(session?: string) {
  if (!session) return false;
  const [payload, signature] = session.split(".");
  if (!payload || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) return false;
  try { return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now(); } catch { return false; }
}
