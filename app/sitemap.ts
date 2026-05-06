import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteOrigin().replace(/\/$/, "");
  const jaRoot = `${base}/`;
  const en = `${base}/en`;
  const hrefLang = {
    "x-default": jaRoot,
    ja: jaRoot,
    en,
  };

  return [
    {
      url: jaRoot,
      lastModified: new Date(),
      alternates: { languages: hrefLang },
    },
    {
      url: en,
      lastModified: new Date(),
      alternates: { languages: hrefLang },
    },
  ];
}

