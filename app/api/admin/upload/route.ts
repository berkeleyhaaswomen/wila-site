import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { storeImage, blobConfigured } from "@/lib/images";

export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024; // before resizing; phone photos are large
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/heic",
  "image/heif"
]);

/**
 * Uploads a spotlight photo and returns a URL to display it.
 *
 * Signed-in admins only. An open upload endpoint would let anyone fill the
 * store, and on the database backend that means anyone could fill the
 * database.
 */
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (!blobConfigured() && !dbConfigured()) {
    return NextResponse.json(
      { error: "No storage is configured. Paste an image URL instead." },
      { status: 501 }
    );
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.type && !ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Use a JPEG, PNG, WebP, AVIF, HEIC, or GIF image." },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That image is over 12 MB. Please pick a smaller one." },
      { status: 413 }
    );
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const stored = await storeImage(input);
    return NextResponse.json(stored);
  } catch (err) {
    console.error("[admin] image upload failed:", err);
    return NextResponse.json(
      { error: "Could not read that image. Try a different file." },
      { status: 500 }
    );
  }
}
