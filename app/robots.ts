import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/reserve", "/f", "/l", "/ja/pop", "/en/pop"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
