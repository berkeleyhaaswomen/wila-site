/**
 * When STATIC_EXPORT=true (set by the GitHub Pages workflow) we build a fully
 * static site into ./out. Otherwise we build normally, which supports the
 * embedded /studio route.
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
  images: isStaticExport
    ? { unoptimized: true }
    : {
        remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }]
      }
};

export default nextConfig;
