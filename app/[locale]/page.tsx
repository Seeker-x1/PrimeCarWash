import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReservationForm from "./reservation-form";
import { Locale, locales, siteContent } from "@/lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = locale === "en" ? "en" : "ja";
  const content = siteContent[resolvedLocale];

  return {
    title: content.heroTitle,
    description: content.heroDescription,
    openGraph: {
      title: content.heroTitle,
      description: content.heroDescription,
      type: "website",
      locale: resolvedLocale === "ja" ? "ja_JP" : "en_US",
      url: `/${resolvedLocale}`,
    },
  };
}

export default async function LocalePage({ params }: PageProps) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const currentLocale = locale as Locale;
  const content = siteContent[currentLocale];
  const alternateLocale = currentLocale === "ja" ? "en" : "ja";

  const serviceItems =
    currentLocale === "ja"
      ? [
          "ボディ無水洗浄 / 窓ガラス拭き / ホイール拭き",
          "ドア開口部 / 車内掃除機 / 内窓ガラス / 内装拭き上げ",
          "6ヶ月に1回の撥水プロテクト特典",
        ]
      : [
          "Waterless body wash / windows / wheel finish",
          "Door sill / vacuum / interior glass / dashboard wipe",
          "Hydrophobic protect treatment once every 6 months",
        ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "PRIME CAR WASH",
    serviceType: "Mobile Car Wash",
    areaServed: "Japan",
    url: `https://primecarwash.vercel.app/${currentLocale}`,
  };

  return (
    <main className="bg-black text-white">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-[#999999] bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <p className="font-mono text-xs tracking-[0.2em]">PRIME CAR WASH</p>
          <Link
            href={`/${alternateLocale}`}
            className="border border-[#999999] px-3 py-1 text-xs tracking-[0.12em] uppercase hover:border-white"
          >
            {alternateLocale}
          </Link>
        </div>
      </header>

      <section className="hero-vignette relative isolate flex min-h-screen items-end">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_60%_20%,#222_0%,#000_60%)]" />
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-32 sm:pb-20">
          <p className="font-serif text-sm text-[#999999]">{content.brandTagline}</p>
          <h1 className="mt-4 font-serif text-5xl leading-none tracking-[0.08em] sm:text-7xl md:text-8xl">
            {content.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#d9d9d9]">{content.heroDescription}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={content.lineUrlPlaceholder}
              className="rounded-full border border-white px-6 py-3 text-xs tracking-[0.16em] uppercase hover:bg-white hover:text-black"
            >
              {content.ctaReserve}
            </a>
            <a
              href="#reservation-form"
              className="rounded-full border border-[#999999] px-6 py-3 text-xs tracking-[0.16em] uppercase hover:border-white"
            >
              {content.ctaContact}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-serif text-3xl tracking-[0.12em]">{content.sectionTitle}</h2>
        <ul className="mt-8 space-y-4 text-sm text-[#d9d9d9]">
          {serviceItems.map((item) => (
            <li key={item} className="border-l border-[#999999] pl-4">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-serif text-3xl tracking-[0.12em]">{content.plansTitle}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {content.plans.map((plan) => (
            <article key={plan.name} className="border border-[#999999] p-4">
              <h3 className="text-xs tracking-[0.08em] text-[#d9d9d9]">{plan.name}</h3>
              <p className="mt-4 font-serif text-3xl">{plan.price}</p>
              <p className="mt-2 text-xs text-[#999999]">{plan.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="reservation-form" className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="font-serif text-3xl tracking-[0.12em]">{content.formTitle}</h2>
        <p className="mt-3 text-sm text-[#d9d9d9]">{content.formDescription}</p>
        <div className="mt-8 border border-[#999999] p-5 sm:p-8">
          <ReservationForm locale={currentLocale} />
        </div>
      </section>

      <footer className="border-t border-[#999999] px-4 py-8 text-center text-xs tracking-[0.1em] text-[#999999]">
        {content.footer}
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
