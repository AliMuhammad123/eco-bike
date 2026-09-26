import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ecobike.example";
const PAGES = ["", "/bike", "/savings", "/build", "/charging", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${SITE_URL}${p}/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: p ? 0.8 : 1,
  }));
}
