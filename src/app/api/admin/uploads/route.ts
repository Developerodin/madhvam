import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { jsonError, jsonOk } from "@/lib/api";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = new Map<string, string>([
  ["application/pdf", ".pdf"],
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
]);

function safeBaseName(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "document";
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return jsonError("Unauthorized", 401);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError("Invalid upload", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return jsonError("Choose a file to upload", 400);
  }
  if (file.size <= 0) return jsonError("File is empty", 400);
  if (file.size > MAX_BYTES) {
    return jsonError("File is too large (max 15 MB)", 400);
  }

  const extFromType = ALLOWED.get(file.type);
  const nameLower = file.name.toLowerCase();
  const extFromName = [".pdf", ".png", ".jpg", ".jpeg", ".webp"].find((e) =>
    nameLower.endsWith(e),
  );
  const ext =
    extFromType ||
    (extFromName === ".jpeg" ? ".jpg" : extFromName) ||
    null;
  if (!ext) {
    return jsonError("Only PDF, PNG, JPG, or WebP files are allowed", 400);
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const fileName = `${safeBaseName(file.name)}-${Date.now()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "documents");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), bytes);

  const url = `/uploads/documents/${fileName}`;
  return jsonOk({ url, fileName, size: file.size });
}
