import type { NextConfig } from "next";

// The trustvault.ar.io shopfront is a single static landing page — no wallet, no crypto,
// so it needs none of the Node polyfills the full app requires. STATIC_EXPORT=1 emits ./out
// as fully static files for Arweave/ArNS hosting (npm run build:static / npm run deploy).
const nextConfig: NextConfig = {
  ...(process.env.STATIC_EXPORT === "1"
    ? { output: "export" as const, images: { unoptimized: true }, trailingSlash: true }
    : {}),
};

export default nextConfig;
