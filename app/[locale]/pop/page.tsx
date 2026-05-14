import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/site-content";
import { popPageContent } from "@/lib/pop-page-content";

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw === "en" ? "en" : "ja";
  const c = popPageContent[locale];
  return {
    title: c.title,
    description: c.description,
    robots: { index: false, follow: false },
  };
}

export default async function PopPromoPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (raw !== "ja" && raw !== "en") notFound();
  const locale = raw as Locale;
  const c = popPageContent[locale];
  const lineHref = locale === "en" ? "/line-pop?lang=en" : "/line-pop";

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-lg">
        <p className="font-serif text-xs tracking-[0.2em] text-[#888]">
          PRIME CAR WASH
        </p>
        <h1 className="mt-4 font-serif text-2xl tracking-tight md:text-3xl">
          {c.title}
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-[#ccc]">{c.lead}</p>
        <ul className="mt-8 space-y-3 text-sm leading-relaxed text-[#aaa]">
          {c.bullets.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-white">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <a
            href={lineHref}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#06C755] px-6 py-4 text-center text-sm font-medium tracking-wide text-black hover:opacity-90"
          >
            {c.ctaLine}
          </a>
          <p className="mt-3 text-center text-xs text-[#666]">{c.ctaDetails}</p>
        </div>
        <p className="mt-16 border-t border-[#333] pt-8 text-xs leading-relaxed text-[#555]">
          {c.footnote}
        </p>
        <p className="mt-6 text-center text-xs">
          <Link href={locale === "en" ? "/en" : "/"} className="text-[#888] underline">
            {locale === "en" ? "Home" : "トップへ戻る"}
          </Link>
        </p>
      </div>
    </main>
  );
}
