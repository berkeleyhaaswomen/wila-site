/**
 * Browser-side image shrinking, run before every upload.
 *
 * Vercel rejects request bodies over 4.5 MB before they reach our code, and a
 * phone photo is routinely 3 to 8 MB. Without this, most uploads from a phone
 * would fail on the deployed site while working fine locally. Downscaling to
 * a 2400px long edge and re-encoding keeps every upload comfortably under the
 * limit; the server then resizes again to its own 1600px cap.
 *
 * Anything the browser cannot decode (HEIC outside Safari, for instance) is
 * sent unchanged, and the server handles it if it is small enough.
 */

const MAX_EDGE = 2400;
const SKIP_BELOW_BYTES = 2.5 * 1024 * 1024;

export async function shrinkForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file; // not decodable here; let the server try
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < SKIP_BELOW_BYTES) {
    bitmap.close();
    return file;
  }

  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.88)
  );
  if (!blob) return file;

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}
