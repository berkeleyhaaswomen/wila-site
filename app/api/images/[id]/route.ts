import { NextResponse } from "next/server";

import { getImage } from "@/lib/images";

export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Serves an uploaded photo from the database.
 *
 * Public on purpose: spotlight photos appear on the public site. Rows are
 * immutable and addressed by a random id, so the response can be cached
 * indefinitely by the browser and by Vercel's edge.
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!UUID.test(params.id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const image = await getImage(params.id);
    if (!image) return new NextResponse("Not found", { status: 404 });

    return new NextResponse(new Uint8Array(image.bytes), {
      headers: {
        "Content-Type": image.mime,
        "Content-Length": String(image.bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (err) {
    console.error("[images] read failed:", err);
    return new NextResponse("Not found", { status: 404 });
  }
}
