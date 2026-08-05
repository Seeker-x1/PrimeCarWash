import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale, siteContent } from "@/lib/site-content";
import {
  areaSlugs,
  getAreaCanonicalPath,
  getAreaPage,
} from "@/lib/area-pages";
import { getAreasHubPath, getGuidesHubPath, guideSlugs, getGuideCanonicalPath, getGuidePost } from "@/lib/guide-posts";
import { getOgImageUrl } from "@/lib/seo-json-ld";
import SiteFooter from "@/components/SiteFooter";

type PageProps = { params: Promise<{ locale: string }> };

const hubCopy = {
  ja: {
    title: "出張洗車 対応エリア一覧｜東京23区",
    description:
      "渋谷・世田谷・目黒を中心に、港区・品川・中野・杉並・大田区などへ出張洗車。エリア別の料金・FAQ・予約へ。",
    h1: "出張洗車 対応エリア",
    lead: "東京都内を中心に、ご指定の洗車場所へ伺います。エリア別ページで料金の目安・よくある質問をご確認ください。",
    primaryLabel: "中心エリア",
    secondaryLabel: "その他対応エリア",
    guidesLink: "洗車ガイド・料金の記事",
  },
  en: {
    title: "Service areas | PRIME CAR WASH Tokyo",
    description:
      "Mobile valeting across Tokyo wards—Shibuya, Setagaya, Meguro, Minato, Shinjuku, and more. Area pages with FAQs and booking.",
    h1: "Service areas",
    lead: "We come to your parking spot across central Tokyo. Open each area page for local FAQs and pricing.",
    primaryLabel: "Core areas",
    secondaryLabel: "Also serving",
    guidesLink: "Car care guides",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale: Locale = locale === "en" ? "en" : "ja";
  const copy = hubCopy[resolvedLocale];
  const canonicalPath = getAreasHubPath(resolvedLocale);
  const jaPath = getAreasHubPath("ja");
  const enPath = getAreasHubPath("en");
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

export default async function AreasHubPage({ params }: PageProps) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const currentLocale = locale as Locale;
  const copy = hubCopy[currentLocale];
  const site = siteContent[currentLocale];
  const homeHref = currentLocale === "ja" ? "/" : "/en";
  const primary = areaSlugs.filter((slug) => getAreaPage(slug)?.isPrimary);
  const secondary = areaSlugs.filter((slug) => !getAreaPage(slug)?.isPrimary);

  const renderList = (slugs: typeof areaSlugs[number][]) => (
    <ul className="mt-4 flex flex-wrap gap-2">
      {slugs.map((slug) => {
        const area = getAreaPage(slug)!;
        const label = currentLocale === "ja" ? area.wardJa : area.wardEn;
        const href = getAreaCanonicalPath(currentLocale, slug);
        return (
          <li key={slug}>
            <Link
              href={href}
              className="inline-block border border-[#999999] px-3 py-2 text-sm hover:border-white"
            >
              {currentLocale === "ja" ? `${label}の出張洗車` : label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <main className="bg-black text-white">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-[#999999] bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href={homeHref} className="font-mono text-xs tracking-[0.2em] hover:text-[#d9d9d9]">
            PRIME CAR WASH
          </Link>
          <Link
            href={currentLocale === "ja" ? "/en/areas" : "/areas"}
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

        <section className="mt-12">
          <h2 className="font-serif text-2xl tracking-[0.12em]">{copy.primaryLabel}</h2>
          {renderList(primary)}
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl tracking-[0.12em]">{copy.secondaryLabel}</h2>
          {renderList(secondary)}
        </section>

        <section className="mt-12 border border-[#999999] p-6">
          <h2 className="text-sm tracking-[0.1em] text-[#d9d9d9]">{copy.guidesLink}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {guideSlugs.map((slug) => {
              const post = getGuidePost(slug)!;
              const label = currentLocale === "ja" ? post.ja.h1 : post.en.h1;
              return (
                <li key={slug}>
                  <Link href={getGuideCanonicalPath(currentLocale, slug)} className="text-[#d9d9d9] hover:text-white">
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-4">
            <Link href={getGuidesHubPath(currentLocale)} className="text-xs tracking-[0.12em] text-[#999999] hover:text-white">
              {currentLocale === "ja" ? "ガイド一覧へ →" : "All guides →"}
            </Link>
          </p>
        </section>

        <div className="mt-12">
          <a
            href={`${homeHref}#reservation-form`}
            className="inline-block rounded-full border border-white px-6 py-3 text-xs tracking-[0.16em] uppercase hover:bg-white hover:text-black"
          >
            {site.ctaReserve}
          </a>
        </div>
      </article>

      <SiteFooter locale={currentLocale} />
    </main>
  );
}
