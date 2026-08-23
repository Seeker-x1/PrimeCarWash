import type { MetadataRoute } from "next";
import { areaSlugs, getAreaCanonicalPath } from "@/lib/area-pages";
import {
  getAreasHubPath,
  getGuideCanonicalPath,
  getGuidesHubPath,
  guideSlugs,
} from "@/lib/guide-posts";
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

  const areasJa = `${base}${getAreasHubPath("ja")}`;
  const areasEn = `${base}${getAreasHubPath("en")}`;
  const guidesJa = `${base}${getGuidesHubPath("ja")}`;
  const guidesEn = `${base}${getGuidesHubPath("en")}`;
  const areasLang = { "x-default": areasJa, ja: areasJa, en: areasEn };
  const guidesLang = { "x-default": guidesJa, ja: guidesJa, en: guidesEn };

  const hubEntries: MetadataRoute.Sitemap = [
    {
      url: areasJa,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: { languages: areasLang },
    },
    {
      url: areasEn,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages: areasLang },
    },
    {
      url: guidesJa,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
      alternates: { languages: guidesLang },
    },
    {
      url: guidesEn,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: guidesLang },
    },
  ];

  const areaEntries: MetadataRoute.Sitemap = areaSlugs.flatMap((slug) => {
    const jaPath = getAreaCanonicalPath("ja", slug);
    const enPath = getAreaCanonicalPath("en", slug);
    const jaUrl = `${base}${jaPath}`;
    const enUrl = `${base}${enPath}`;
    const languages = { "x-default": jaUrl, ja: jaUrl, en: enUrl };
    return [
      {
        url: jaUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages },
      },
      {
        url: enUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages },
      },
    ];
  });

  const guideEntries: MetadataRoute.Sitemap = guideSlugs.flatMap((slug) => {
    const jaPath = getGuideCanonicalPath("ja", slug);
    const enPath = getGuideCanonicalPath("en", slug);
    const jaUrl = `${base}${jaPath}`;
    const enUrl = `${base}${enPath}`;
    const languages = { "x-default": jaUrl, ja: jaUrl, en: enUrl };
    return [
      {
        url: jaUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: { languages },
      },
      {
        url: enUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.55,
        alternates: { languages },
      },
    ];
  });

  return [...homeEntries, ...hubEntries, ...areaEntries, ...guideEntries];
}
