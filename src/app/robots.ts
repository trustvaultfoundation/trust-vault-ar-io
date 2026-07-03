import type { MetadataRoute } from "next";

// Statically emitted at build time (works under output: "export").
export const dynamic = "force-static";

const SITE_URL = "https://trustvault.ar.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
