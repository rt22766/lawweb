import type { MetadataRoute } from "next";

import { siteConfig } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteConfig.nav.map((item) => ({
    url: `${siteConfig.url}${item.href}`,
    lastModified: new Date(),
  }));
}
