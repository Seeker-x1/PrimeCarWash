import type { Locale } from "@/lib/site-content";
import { siteContent } from "@/lib/site-content";
import { getSiteOrigin } from "@/lib/site-url";
import type { AreaPageContent } from "@/lib/area-pages";
import { getAreaCanonicalPath, getAreaContent } from "@/lib/area-pages";
const LINE_OFFICIAL_ID =
  process.env.NEXT_PUBLIC_LINE_OFFICIAL_ID ?? "@834ecayh";

const OG_IMAGE_PATH = "/hero-carwash.png";

const PRIMARY_WARDS_JA = ["渋谷区", "世田谷区", "目黒区"] as const;
const SECONDARY_WARDS_JA = [
  "港区",
  "品川区",
  "中野区",
  "杉並区",
  "大田区",
] as const;

const PRIMARY_WARDS_EN = [
  "Shibuya, Tokyo",
  "Setagaya, Tokyo",
  "Meguro, Tokyo",
] as const;
const SECONDARY_WARDS_EN = [
  "Minato, Tokyo",
  "Shinagawa, Tokyo",
  "Nakano, Tokyo",
  "Suginami, Tokyo",
  "Ota, Tokyo",
] as const;

/** Absolute OG / schema image URL. */
export function getOgImageUrl(): string {
  return `${getSiteOrigin()}${OG_IMAGE_PATH}`;
}

function buildAreaServed(locale: Locale) {
  const wards =
    locale === "ja"
      ? [...PRIMARY_WARDS_JA, ...SECONDARY_WARDS_JA]
      : [...PRIMARY_WARDS_EN, ...SECONDARY_WARDS_EN];

  return wards.map((name) => ({
    "@type": "City" as const,
    name,
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: locale === "ja" ? "東京都" : "Tokyo",
    },
  }));
}

/**
 * JSON-LD @graph for the locale LP.
 * Intentionally omits telephone and postal address (mobile-only service).
 */
export function buildLocaleJsonLd(locale: Locale) {
  const origin = getSiteOrigin();
  const content = siteContent[locale];
  const pageUrl = locale === "ja" ? origin : `${origin}/en`;
  const inLanguage = locale === "ja" ? "ja-JP" : "en-US";
  const lineProfileUrl = `https://line.me/R/ti/p/${LINE_OFFICIAL_ID}`;
  const imageUrl = getOgImageUrl();
  const description =
    content.searchDescription ?? content.heroDescription;

  const offers = content.plans.map((plan) => {
    const numeric = Number(plan.price.replace(/[^\d]/g, ""));
    return {
      "@type": "Offer" as const,
      name: plan.name,
      description: plan.detail,
      price: Number.isFinite(numeric) ? String(numeric) : undefined,
      priceCurrency: "JPY",
      availability: "https://schema.org/InStock",
      url: `${pageUrl}#reservation-form`,
    };
  });

  const faqId = `${pageUrl}#faq`;
  const faqEntities = content.faqItems.map((item) => ({
    "@type": "Question" as const,
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: item.answer,
    },
  }));

  const orgId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const businessId = `${pageUrl}#localbusiness`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: "PRIME CAR WASH",
        url: origin,
        image: imageUrl,
        logo: imageUrl,
        sameAs: [lineProfileUrl],
        description,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "PRIME CAR WASH",
        url: origin,
        inLanguage: ["ja-JP", "en-US"],
        publisher: { "@id": orgId },
        potentialAction: {
          "@type": "ReserveAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${pageUrl}#reservation-form`,
            actionPlatform: [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform",
            ],
          },
          name: locale === "ja" ? "出張洗車を予約" : "Book mobile valeting",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": businessId,
        name: "PRIME CAR WASH",
        url: pageUrl,
        image: imageUrl,
        description,
        serviceType:
          locale === "ja"
            ? "出張洗車（モバイルベレッティング）"
            : "Mobile Car Wash / Premium Mobile Valeting",
        areaServed: buildAreaServed(locale),
        priceRange: "¥¥",
        sameAs: [lineProfileUrl],
        parentOrganization: { "@id": orgId },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name:
            locale === "ja"
              ? "出張洗車サービスメニュー"
              : "Mobile valeting service menu",
          itemListElement: offers,
        },
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        url: `${pageUrl}#faq`,
        inLanguage,
        isPartOf: { "@id": websiteId },
        mainEntity: faqEntities,
      },
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: content.searchTitle ?? content.heroTitle,
        description,
        inLanguage,
        isPartOf: { "@id": websiteId },
        about: { "@id": businessId },
        primaryImageOfPage: imageUrl,
      },
    ],
  };
}

/** JSON-LD for ward-level landing pages (local SEO). */
export function buildAreaPageJsonLd(locale: Locale, page: AreaPageContent) {
  const origin = getSiteOrigin();
  const content = getAreaContent(locale, page);
  const canonicalPath = getAreaCanonicalPath(locale, page.slug);
  const pageUrl = `${origin}${canonicalPath}`;
  const homeUrl = locale === "ja" ? origin : `${origin}/en`;
  const inLanguage = locale === "ja" ? "ja-JP" : "en-US";
  const imageUrl = getOgImageUrl();
  const lineProfileUrl = `https://line.me/R/ti/p/${LINE_OFFICIAL_ID}`;
  const orgId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const wardName = locale === "ja" ? page.wardJa : page.wardEn;

  const breadcrumbList = {
    "@type": "BreadcrumbList" as const,
    itemListElement: [
      {
        "@type": "ListItem" as const,
        position: 1,
        name: locale === "ja" ? "ホーム" : "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem" as const,
        position: 2,
        name: content.h1,
        item: pageUrl,
      },
    ],
  };

  const faqEntities = content.faq.map((item) => ({
    "@type": "Question" as const,
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: item.answer,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbList,
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "PRIME CAR WASH",
        url: origin,
        publisher: { "@id": orgId },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: content.h1,
        description: content.searchDescription,
        url: pageUrl,
        image: imageUrl,
        provider: { "@id": orgId },
        areaServed: {
          "@type": "City",
          name: wardName,
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: locale === "ja" ? "東京都" : "Tokyo",
          },
        },
        serviceType:
          locale === "ja" ? "出張洗車" : "Mobile car wash / mobile valeting",
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        url: `${pageUrl}#faq`,
        inLanguage,
        mainEntity: faqEntities,
      },
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: content.searchTitle,
        description: content.searchDescription,
        inLanguage,
        isPartOf: { "@id": websiteId },
      },
      {
        "@type": "Organization",
        "@id": orgId,
        name: "PRIME CAR WASH",
        url: origin,
        sameAs: [lineProfileUrl],
      },
    ],
  };
}
