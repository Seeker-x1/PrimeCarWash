import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale, siteContent } from "@/lib/site-content";
import {
  areaSlugs,
  getAreaCanonicalPath,
  getAreaContent,
  getAreaPage,
  isAreaSlug,
} from "@/lib/area-pages";
import { getLineConsultationUrl } from "@/lib/line-consultation";
import { buildAreaPageJsonLd, getOgImageUrl } from "@/lib/seo-json-ld";
import AmanBookingForm from "@/components/AmanBookingForm";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    areaSlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isAreaSlug(slug)) return {};
  const resolvedLocale: Locale = locale === "en" ? "en" : "ja";
  const page = getAreaPage(slug);
  if (!page) return {};
  const content = getAreaContent(resolvedLocale, page);
  const canonicalPath = getAreaCanonicalPath(resolvedLocale, slug);
  const jaPath = getAreaCanonicalPath("ja", slug);
  const enPath = getAreaCanonicalPath("en", slug);
  const ogImage = {
    url: getOgImageUrl(),
    width: 1200,
    height: 630,
    alt: content.h1,
  };

  return {
    title: { absolute: content.searchTitle },
    description: content.searchDescription,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "x-default": jaPath,
        ja: jaPath,
        en: enPath,
      },
    },
    openGraph: {
      title: content.searchTitle,
      description: content.searchDescription,
      type: "website",
      siteName: "PRIME CAR WASH",
      locale: resolvedLocale === "ja" ? "ja_JP" : "en_US",
      url: canonicalPath,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: content.searchTitle,
      description: content.searchDescription,
      images: [ogImage.url],
    },
  };
}

export default async function AreaLandingPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale) || !isAreaSlug(slug)) notFound();

  const currentLocale = locale as Locale;
  const page = getAreaPage(slug);
  if (!page) notFound();

  const content = getAreaContent(currentLocale, page);
  const site = siteContent[currentLocale];
  const lineConsultationUrl = getLineConsultationUrl(currentLocale);
  const homeHref = currentLocale === "ja" ? "/" : "/en";
  const jsonLd = buildAreaPageJsonLd(currentLocale, page);

  return (
    <main className="bg-black text-white">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-[#999999] bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href={homeHref} className="font-mono text-xs tracking-[0.2em] hover:text-[#d9d9d9]">
            PRIME CAR WASH
          </Link>
          <Link
            href={currentLocale === "ja" ? "/en" : "/"}
            className="border border-[#999999] px-3 py-1 text-xs tracking-[0.12em] uppercase hover:border-white"
          >
            {currentLocale === "ja" ? "EN" : "JA"}
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-6xl px-4 pb-16 pt-28">
        <nav aria-label="Breadcrumb" className="text-xs tracking-[0.08em] text-[#999999]">
          <Link href={homeHref} className="hover:text-white">
            {currentLocale === "ja" ? "ホーム" : "Home"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#d9d9d9]">{content.h1}</span>
        </nav>

        <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[0.06em] sm:text-5xl">
          {content.h1}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#d9d9d9]">{content.lead}</p>

        <div className="mt-8 space-y-4 text-sm leading-7 text-[#d9d9d9]">
          {content.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 border border-[#999999] p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-[#999999]">
            {currentLocale === "ja" ? "主な対応エリア" : "Areas we serve"}
          </p>
          <p className="mt-2 text-white">{content.spots}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`${homeHref}#reservation-form`}
            className="rounded-full border border-white px-6 py-3 text-xs tracking-[0.16em] uppercase hover:bg-white hover:text-black"
          >
            {site.ctaReserve}
          </a>
          <a
            href={lineConsultationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#999999] px-6 py-3 text-xs tracking-[0.16em] uppercase hover:border-white"
          >
            {site.ctaContact}
          </a>
        </div>

        <section id="faq" className="mt-16">
          <h2 className="font-serif text-2xl tracking-[0.12em]">FAQ</h2>
          <dl className="mt-6 space-y-4">
            {content.faq.map((item) => (
              <div key={item.question} className="border border-[#999999] p-5">
                <dt className="font-semibold text-white">{item.question}</dt>
                <dd className="mt-3 text-sm leading-7 text-[#d9d9d9]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-16">
          <h2 className="font-serif text-2xl tracking-[0.12em]">
            {currentLocale === "ja" ? "他エリアの出張洗車" : "Other service areas"}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            {areaSlugs
              .filter((s) => s !== slug)
              .map((other) => {
                const otherPage = getAreaPage(other)!;
                const label = currentLocale === "ja" ? otherPage.wardJa : otherPage.wardEn;
                const href = getAreaCanonicalPath(currentLocale, other);
                return (
                  <li key={other}>
                    <Link
                      href={href}
                      className="inline-block border border-[#999999] px-3 py-2 hover:border-white"
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </section>
      </article>

      <section id="reservation-form" className="border-t border-[#999999] py-8">
        <AmanBookingForm headingLevel="h2" />
      </section>

      <footer className="border-t border-[#999999] px-4 py-8 text-center text-xs tracking-[0.1em] text-[#999999]">
        {site.footer}
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/<\/script>/gi, "<\\/script>"),
        }}
      />
    </main>
  );
}
