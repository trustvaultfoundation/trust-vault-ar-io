import type { MetadataRoute } from "next";

// Statically emitted at build time (works under output: "export"). The ar.io mirror is a
// single landing page; the full app (and its content pages) lives on trustvault.foundation.
export const dynamic = "force-static";

const SITE_URL = "https://trustvault.ar.io";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
