import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Locale, siteContent } from "@/lib/site-content";
import {
  getGuideCanonicalPath,
  getGuideContent,
  getGuidePost,
  getGuidesHubPath,
  guideSlugs,
  isGuideSlug,
} from "@/lib/guide-posts";
import { getLineConsultationUrl } from "@/lib/line-consultation";
import { getOgImageUrl } from "@/lib/seo-json-ld";
import AmanBookingForm from "@/components/AmanBookingForm";
import SiteFooter from "@/components/SiteFooter";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    guideSlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isGuideSlug(slug)) return {};
  const resolvedLocale: Locale = locale === "en" ? "en" : "ja";
  const post = getGuidePost(slug);
  if (!post) return {};
  const content = getGuideContent(resolvedLocale, post);
  const canonicalPath = getGuideCanonicalPath(resolvedLocale, slug);
  const jaPath = getGuideCanonicalPath("ja", slug);
  const enPath = getGuideCanonicalPath("en", slug);
  const ogImage = { url: getOgImageUrl(), width: 1200, height: 630, alt: content.h1 };

  return {
    title: { absolute: content.searchTitle },
    description: content.searchDescription,
    alternates: {
      canonical: canonicalPath,
      languages: { "x-default": jaPath, ja: jaPath, en: enPath },
    },
    openGraph: {
      title: content.searchTitle,
      description: content.searchDescription,
      type: "article",
      siteName: "PRIME CAR WASH",
      locale: resolvedLocale === "ja" ? "ja_JP" : "en_US",
      url: canonicalPath,
      images: [ogImage],
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: content.searchTitle,
      description: content.searchDescription,
      images: [ogImage.url],
    },
  };
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale) || !isGuideSlug(slug)) notFound();

  const currentLocale = locale as Locale;
  const post = getGuidePost(slug);
  if (!post) notFound();

  const content = getGuideContent(currentLocale, post);
  const site = siteContent[currentLocale];
  const homeHref = currentLocale === "ja" ? "/" : "/en";
  const lineConsultationUrl = getLineConsultationUrl(currentLocale);
  const hubHref = getGuidesHubPath(currentLocale);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.h1,
    description: content.searchDescription,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: "PRIME CAR WASH" },
    publisher: { "@type": "Organization", name: "PRIME CAR WASH" },
    inLanguage: currentLocale === "ja" ? "ja-JP" : "en-US",
  };

  return (
    <main className="bg-black text-white">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-[#999999] bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href={homeHref} className="font-mono text-xs tracking-[0.2em] hover:text-[#d9d9d9]">
            PRIME CAR WASH
          </Link>
          <Link
            href={currentLocale === "ja" ? `/en/guides/${slug}` : `/guides/${slug}`}
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
          <Link href={hubHref} className="hover:text-white">
            {currentLocale === "ja" ? "ガイド" : "Guides"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#d9d9d9]">{content.h1}</span>
        </nav>

        <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[0.06em] sm:text-5xl">
          {content.h1}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#d9d9d9]">{content.lead}</p>

        {content.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="font-serif text-2xl tracking-[0.12em]">{section.heading}</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[#d9d9d9]">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-12 flex flex-wrap gap-3">
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

        <section className="mt-16">
          <h2 className="font-serif text-2xl tracking-[0.12em]">
            {currentLocale === "ja" ? "他のガイド" : "More guides"}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            {guideSlugs
              .filter((s) => s !== slug)
              .map((other) => {
                const otherPost = getGuidePost(other)!;
                const label = currentLocale === "ja" ? otherPost.ja.h1 : otherPost.en.h1;
                return (
                  <li key={other}>
                    <Link
                      href={getGuideCanonicalPath(currentLocale, other)}
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

      <SiteFooter locale={currentLocale} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/<\/script>/gi, "<\\/script>"),
        }}
      />
    </main>
  );
}
