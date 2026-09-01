/**
 * The admin site at /admin needs a server (Server Actions, dynamic routes, an
 * upload API route), so a static export can no longer include it. The
 * STATIC_EXPORT path is kept only for a hypothetical public-site-only build,
 * and the GitHub Pages workflow that used it is disabled. Deploy on Vercel.
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isStaticExport && {
    output: "export",
    // Static export can't optimize images at request time.
    images: { unoptimized: true }
  }),
  ...(basePath && { basePath, assetPrefix: basePath }),
  // Spotlight photos are plain <img> tags pointing at Vercel Blob or a pasted
  // URL, so next/image isn't in play, but keep uploads working if it ever is.
  images: isStaticExport
    ? { unoptimized: true }
    : {
        remotePatterns: [
          { protocol: "https", hostname: "*.public.blob.vercel-storage.com" }
        ]
      }
};

export default nextConfig;
