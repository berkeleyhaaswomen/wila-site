"use client";

import { useRef, useState } from "react";
import { Label } from "./Field";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-ink " +
  "outline-none transition placeholder:text-ink/35 focus:border-berkeley-blue " +
  "focus:ring-2 focus:ring-berkeley-blue/20";

/**
 * Photo picker with two ways in: upload a file, or paste a URL. The canonical
 * value is always the URL in the text input. Uploading just fills it in, so
 * the form works identically whether or not blob storage is set up.
 */
export default function PhotoField({
  name = "photoUrl",
  defaultValue,
  uploadsEnabled
}: {
  name?: string;
  defaultValue?: string | null;
  uploadsEnabled: boolean;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Upload failed.");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <Label hint="upload a file, or paste a link">Photo</Label>

      <div className="mt-2 flex flex-wrap items-start gap-4">
        <div className="h-28 w-24 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-soft-gray">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setError("That image URL didn't load.")}
            />
          ) : (
            <div className="grid h-full w-full place-items-center px-2 text-center text-[10px] leading-tight text-ink/40">
              No photo, the illustrated placeholder will be used
            </div>
          )}
        </div>

        <div className="min-w-[220px] flex-1 space-y-2">
          <input
            className={inputClass}
            name={name}
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            placeholder="https://example.com/priya.jpg"
          />

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
            <button
              type="button"
              disabled={!uploadsEnabled || busy}
              onClick={() => fileRef.current?.click()}
              className="rounded-full border border-black/15 px-4 py-1.5 text-sm font-semibold text-ink/80 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Uploading…" : "Upload a photo"}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => {
                  setUrl("");
                  setError(null);
                }}
                className="text-sm font-medium text-ink/55 hover:text-ink"
              >
                Remove
              </button>
            )}
          </div>

          {!uploadsEnabled && (
            <p className="text-xs text-ink/50">
              File uploads are off until <code className="font-mono">BLOB_READ_WRITE_TOKEN</code>{" "}
              is set. You can still paste an image URL.
            </p>
          )}
          {error && <p className="text-xs text-red-700">{error}</p>}
          <p className="text-xs text-ink/45">
            Portrait orientation works best, roughly 800×1000, under 5 MB.
          </p>
        </div>
      </div>
    </div>
  );
}
