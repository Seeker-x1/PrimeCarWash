import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://primecarwash.vercel.app";

  return [
    {
      url: `${base}/ja`,
      lastModified: new Date(),
      alternates: {
        languages: {
          ja: `${base}/ja`,
          en: `${base}/en`,
        },
      },
    },
    {
      url: `${base}/en`,
      lastModified: new Date(),
      alternates: {
        languages: {
          ja: `${base}/ja`,
          en: `${base}/en`,
        },
      },
    },
  ];
}

