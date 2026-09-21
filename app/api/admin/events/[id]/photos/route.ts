import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth";
import { getEvent, addEventPhoto } from "@/lib/repo";
import { storeImage } from "@/lib/images";

export const runtime = "nodejs";

// Vercel refuses bodies over 4.5 MB before this runs. The browser shrinks
// each photo first, so this is a backstop rather than the effective limit.
const MAX_BYTES = 4.5 * 1024 * 1024;

/**
 * Attaches one photo to an event. The admin uploader sends several files one
 * request at a time, which keeps each body small and lets a single bad file
 * fail on its own without losing the rest of the batch.
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const event = await getEvent(params.id).catch(() => null);
  if (!event) {
    return NextResponse.json({ error: "That event no longer exists." }, { status: 404 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.type && !file.type.startsWith("image/")) {
    return NextResponse.json({ error: `${file.name} is not an image.` }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: `${file.name} is too large.` }, { status: 413 });
  }

  try {
    const stored = await storeImage(Buffer.from(await file.arrayBuffer()));
    const photo = await addEventPhoto(event.id!, stored.url, stored.width, stored.height);
    revalidatePath("/photos");
    revalidatePath("/events");
    return NextResponse.json(photo);
  } catch (err) {
    console.error("[admin] event photo upload failed:", err);
    return NextResponse.json(
      { error: `Could not read ${file.name}. Try a different file.` },
      { status: 500 }
    );
  }
}
