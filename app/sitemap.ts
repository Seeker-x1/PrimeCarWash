import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteOrigin();
  const ja = `${base}/ja`;
  const en = `${base}/en`;
  const hrefLang = {
    "x-default": ja,
    ja,
    en,
  };

  return [
    {
      url: ja,
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

