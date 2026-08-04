import type { MetadataRoute } from "next";
import { areaSlugs, getAreaCanonicalPath } from "@/lib/area-pages";
import { getSiteOrigin } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteOrigin().replace(/\/$/, "");
  const jaRoot = `${base}/`;
  const en = `${base}/en`;
  const now = new Date();

  const homeEntries: MetadataRoute.Sitemap = [
    {
      url: jaRoot,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: { "x-default": jaRoot, ja: jaRoot, en },
      },
    },
    {
      url: en,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: { "x-default": jaRoot, ja: jaRoot, en },
      },
    },
  ];

  const areaEntries: MetadataRoute.Sitemap = areaSlugs.flatMap((slug) => {
    const jaPath = getAreaCanonicalPath("ja", slug);
    const enPath = getAreaCanonicalPath("en", slug);
    const jaUrl = `${base}${jaPath}`;
    const enUrl = `${base}${enPath}`;
    return [
      {
        url: jaUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: { "x-default": jaUrl, ja: jaUrl, en: enUrl },
        },
      },
      {
        url: enUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: { "x-default": jaUrl, ja: jaUrl, en: enUrl },
        },
      },
    ];
  });

  return [...homeEntries, ...areaEntries];
}
