import type { Locale } from "@/lib/site-content";
import { siteContent } from "@/lib/site-content";
import { getSiteOrigin } from "@/lib/site-url";

const LINE_OFFICIAL_ID =
  process.env.NEXT_PUBLIC_LINE_OFFICIAL_ID ?? "@834ecayh";

const OG_IMAGE_PATH = "/hero-carwash.png";

const PRIMARY_WARDS_JA = ["渋谷区", "世田谷区", "目黒区"] as const;
const SECONDARY_WARDS_JA = ["港区", "品川区", "中野区"] as const;

const PRIMARY_WARDS_EN = [
  "Shibuya, Tokyo",
  "Setagaya, Tokyo",
  "Meguro, Tokyo",
] as const;
const SECONDARY_WARDS_EN = [
  "Minato, Tokyo",
  "Shinagawa, Tokyo",
  "Nakano, Tokyo",
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
