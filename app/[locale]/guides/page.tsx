import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale, siteContent } from "@/lib/site-content";
import {
  getAreasHubPath,
  getGuideCanonicalPath,
  getGuideContent,
  getGuidePost,
  getGuidesHubPath,
  guidePosts,
  guideSlugs,
  isGuideSlug,
} from "@/lib/guide-posts";
import { getLineConsultationUrl } from "@/lib/line-consultation";
import { getOgImageUrl } from "@/lib/seo-json-ld";
import SiteFooter from "@/components/SiteFooter";

type PageProps = { params: Promise<{ locale: string }> };

const hubCopy = {
  ja: {
    title: "出張洗車ガイド｜料金・無水洗車・マンション洗車",
    description:
      "出張洗車とコイン洗車の違い、無水洗車のメリット、マンション駐車場での依頼、高級車ケア、東京の料金相場を解説。PRIME CAR WASH。",
    h1: "出張洗車ガイド",
    lead: "出張洗車を検討中の方向けに、料金・施工方法・マンション対応などをまとめました。",
  },
  en: {
    title: "Mobile valeting guides | PRIME CAR WASH",
    description:
      "Guides on mobile vs coin wash, waterless cleaning, apartment parking, luxury cars, and Tokyo pricing.",
    h1: "Valeting guides",
    lead: "Articles for drivers comparing mobile valeting options in Tokyo.",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale: Locale = locale === "en" ? "en" : "ja";
  const copy = hubCopy[resolvedLocale];
  const canonicalPath = getGuidesHubPath(resolvedLocale);
  const jaPath = getGuidesHubPath("ja");
  const enPath = getGuidesHubPath("en");
  const ogImage = { url: getOgImageUrl(), width: 1200, height: 630, alt: copy.h1 };

  return {
    title: { absolute: copy.title },
    description: copy.description,
    alternates: {
      canonical: canonicalPath,
      languages: { "x-default": jaPath, ja: jaPath, en: enPath },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: "website",
      siteName: "PRIME CAR WASH",
      locale: resolvedLocale === "ja" ? "ja_JP" : "en_US",
      url: canonicalPath,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [ogImage.url],
    },
  };
}

export default async function GuidesHubPage({ params }: PageProps) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const currentLocale = locale as Locale;
  const copy = hubCopy[currentLocale];
  const homeHref = currentLocale === "ja" ? "/" : "/en";

  return (
    <main className="bg-black text-white">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-[#999999] bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href={homeHref} className="font-mono text-xs tracking-[0.2em] hover:text-[#d9d9d9]">
            PRIME CAR WASH
          </Link>
          <Link
            href={currentLocale === "ja" ? "/en/guides" : "/guides"}
            className="border border-[#999999] px-3 py-1 text-xs tracking-[0.12em] uppercase hover:border-white"
          >
            {currentLocale === "ja" ? "EN" : "JA"}
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-6xl px-4 pb-8 pt-28">
        <nav aria-label="Breadcrumb" className="text-xs tracking-[0.08em] text-[#999999]">
          <Link href={homeHref} className="hover:text-white">
            {currentLocale === "ja" ? "ホーム" : "Home"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#d9d9d9]">{copy.h1}</span>
        </nav>

        <h1 className="mt-6 font-serif text-4xl tracking-[0.06em]">{copy.h1}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#d9d9d9]">{copy.lead}</p>

        <ul className="mt-12 space-y-6">
          {guidePosts.map((post) => {
            const content = getGuideContent(currentLocale, post);
            const href = getGuideCanonicalPath(currentLocale, post.slug);
            return (
              <li key={post.slug} className="border border-[#999999] p-6">
                <Link href={href} className="group block">
                  <h2 className="font-serif text-2xl tracking-[0.08em] group-hover:text-[#d9d9d9]">
                    {content.h1}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#999999]">{content.lead}</p>
                  <span className="mt-4 inline-block text-xs tracking-[0.12em] text-[#d9d9d9]">
                    {currentLocale === "ja" ? "続きを読む →" : "Read more →"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-12">
          <Link href={getAreasHubPath(currentLocale)} className="text-sm text-[#999999] hover:text-white">
            {currentLocale === "ja" ? "対応エリア一覧へ →" : "Service areas →"}
          </Link>
        </p>
      </article>

      <SiteFooter locale={currentLocale} />
    </main>
  );
}
