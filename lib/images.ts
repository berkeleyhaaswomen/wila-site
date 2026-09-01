import "server-only";

import sharp from "sharp";

import { query, queryOne } from "./db";

/**
 * Photo storage.
 *
 * Two backends, chosen at call time. Vercel Blob is used when
 * BLOB_READ_WRITE_TOKEN is present, because a CDN is the right home for
 * images. Without it, the photo is resized and written to Postgres and served
 * back through /api/images/[id]. That keeps uploads working with nothing to
 * set up beyond the database the site already needs.
 *
 * Everything is normalised before storage: EXIF rotation is applied and
 * stripped, the long edge is capped, and the result is re-encoded as JPEG. A
 * 12MP phone photo lands at roughly 200KB.
 */

const MAX_EDGE = 1600;
const JPEG_QUALITY = 82;

export type StoredImage = { url: string; width: number; height: number };

export async function processImage(input: Buffer) {
  const pipeline = sharp(input, { failOn: "none" })
    .rotate() // applies the EXIF orientation, then drops the tag
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true
    })
    .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true });

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
  return { bytes: data, width: info.width, height: info.height };
}

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Writes to whichever backend is available and returns a servable URL. */
export async function storeImage(input: Buffer): Promise<StoredImage> {
  const { bytes, width, height } = await processImage(input);

  if (blobConfigured()) {
    const { put } = await import("@vercel/blob");
    const blob = await put("spotlights/photo.jpg", bytes, {
      access: "public",
      addRandomSuffix: true,
      contentType: "image/jpeg"
    });
    return { url: blob.url, width, height };
  }

  const row = await queryOne<{ id: string }>(
    `INSERT INTO images (mime, width, height, bytes)
     VALUES ('image/jpeg', $1, $2, $3)
     RETURNING id`,
    [width, height, bytes]
  );
  if (!row) throw new Error("Image insert returned no row");
  return { url: `/api/images/${row.id}`, width, height };
}

export async function getImage(id: string) {
  const rows = await query<{ mime: string; bytes: Buffer }>(
    `SELECT mime, bytes FROM images WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}
