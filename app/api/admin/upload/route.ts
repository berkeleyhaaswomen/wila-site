import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif"
]);

/**
 * Uploads a spotlight photo to Vercel Blob and returns its public URL.
 *
 * Signed-in admins only — an open upload endpoint would let anyone use the
 * blob store as free file hosting.
 */
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Uploads aren't configured. Set BLOB_READ_WRITE_TOKEN, or paste an image URL instead."
      },
      { status: 501 }
    );
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Use a JPEG, PNG, WebP, AVIF, or GIF image." },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "That image is over 5 MB. Please resize it and try again." },
      { status: 413 }
    );
  }

  // Ignore any client-supplied path; keep the extension only.
  const ext = (file.name.split(".").pop() ?? "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 5);

  try {
    const blob = await put(`spotlights/photo.${ext}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("[admin] blob upload failed:", err);
    return NextResponse.json(
      { error: "Upload failed. Try again, or paste an image URL instead." },
      { status: 500 }
    );
  }
}
