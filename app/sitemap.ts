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

  const hubEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}${getAreasHubPath("ja")}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: {
        languages: {
          "x-default": `${base}${getAreasHubPath("ja")}`,
          ja: `${base}${getAreasHubPath("ja")}`,
          en: `${base}${getAreasHubPath("en")}`,
        },
      },
    },
    {
      url: `${base}${getAreasHubPath("en")}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
      alternates: {
        languages: {
          "x-default": `${base}${getAreasHubPath("ja")}`,
          ja: `${base}${getAreasHubPath("ja")}`,
          en: `${base}${getAreasHubPath("en")}`,
        },
      },
    },
    {
      url: `${base}${getGuidesHubPath("ja")}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
      alternates: {
        languages: {
          "x-default": `${base}${getGuidesHubPath("ja")}`,
          ja: `${base}${getGuidesHubPath("ja")}`,
          en: `${base}${getGuidesHubPath("en")}`,
        },
      },
    },
    {
      url: `${base}${getGuidesHubPath("en")}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
      alternates: {
        languages: {
          "x-default": `${base}${getGuidesHubPath("ja")}`,
          ja: `${base}${getGuidesHubPath("ja")}`,
          en: `${base}${getGuidesHubPath("en")}`,
        },
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

  const guideEntries: MetadataRoute.Sitemap = guideSlugs.flatMap((slug) => {
    const jaPath = getGuideCanonicalPath("ja", slug);
    const enPath = getGuideCanonicalPath("en", slug);
    const jaUrl = `${base}${jaPath}`;
    const enUrl = `${base}${enPath}`;
    return [
      {
        url: jaUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: {
          languages: { "x-default": jaUrl, ja: jaUrl, en: enUrl },
        },
      },
      {
        url: enUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.65,
        alternates: {
          languages: { "x-default": jaUrl, ja: jaUrl, en: enUrl },
        },
      },
    ];
  });

  return [...homeEntries, ...hubEntries, ...areaEntries, ...guideEntries];
}
