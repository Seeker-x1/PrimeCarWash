import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Locale, locales, siteContent } from "@/lib/site-content";
import { getLineConsultationUrl } from "@/lib/line-consultation";
import { getSiteOrigin } from "@/lib/site-url";
import BlurFade from "@/components/BlurFade";
import AmanBookingForm from "@/components/AmanBookingForm";

type PageProps = { params: Promise<{ locale: string }> };

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
    alternates: {
      canonical: `/${resolvedLocale}`,
      languages: {
        ja: "/ja",
        en: "/en",
      },
    },
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
  const lineConsultationUrl = getLineConsultationUrl(currentLocale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "PRIME CAR WASH",
    serviceType: "Mobile Car Wash",
    areaServed: "Japan",
    url: `${getSiteOrigin()}/${currentLocale}`,
  };

  return (
    <main className="bg-black text-white">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-[#999999] bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <p className="font-mono text-xs tracking-[0.2em]">PRIME CAR WASH</p>
          <Link href={`/${alternateLocale}`} className="border border-[#999999] px-3 py-1 text-xs tracking-[0.12em] uppercase hover:border-white">
            {alternateLocale}
          </Link>
        </div>
      </header>

      <section className="hero-vignette relative isolate flex min-h-screen items-end">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero-carwash.png"
            alt={content.heroImageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-32 sm:pb-20">
          <BlurFade delay={0}>
            <p className="font-serif text-sm text-white">{content.brandTagline}</p>
          </BlurFade>
          <BlurFade delay={0.12}>
            <h1 className="mt-4 font-serif text-5xl leading-none tracking-[0.08em] sm:text-7xl md:text-8xl">{content.heroTitle}</h1>
          </BlurFade>
          <BlurFade delay={0.24}>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#d9d9d9]">{content.heroDescription}</p>
          </BlurFade>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={lineConsultationUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white px-6 py-3 text-xs tracking-[0.16em] uppercase hover:bg-white hover:text-black">{content.ctaReserve}</a>
            <a href="#reservation-form" className="rounded-full border border-[#999999] px-6 py-3 text-xs tracking-[0.16em] uppercase hover:border-white">{content.ctaContact}</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <BlurFade>
          <h2 className="font-serif text-3xl tracking-[0.12em]">{content.serviceScopeTitle}</h2>
        </BlurFade>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <BlurFade delay={0.1} className="border border-[#999999] bg-[#050505]">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src="/service-exterior.png"
                alt={currentLocale === "ja" ? "外部洗車の施工イメージ" : "Exterior wash service detail"}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-sm tracking-[0.1em] text-[#d9d9d9]">{content.exteriorTitle}</h3>
              <ul className="mt-4 space-y-3 text-sm text-[#d9d9d9]">
                {content.exteriorItems.map((item) => (
                  <li key={item.label} className="border-l border-[#999999] pl-4">
                    <span className="font-semibold text-white">{item.label}</span> - {item.description}
                  </li>
                ))}
              </ul>
            </div>
          </BlurFade>
          <BlurFade delay={0.2} className="border border-[#999999] bg-[#050505]">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src="/service-interior.png"
                alt={currentLocale === "ja" ? "内装清掃の施工イメージ" : "Interior cleaning service detail"}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-sm tracking-[0.1em] text-[#d9d9d9]">{content.interiorTitle}</h3>
              <ul className="mt-4 space-y-3 text-sm text-[#d9d9d9]">
                {content.interiorItems.map((item) => (
                  <li key={item.label} className="border-l border-[#999999] pl-4">
                    <span className="font-semibold text-white">{item.label}</span> - {item.description}
                  </li>
                ))}
              </ul>
            </div>
          </BlurFade>
        </div>
        <div className="mt-8 border border-[#999999] p-4 text-sm text-[#d9d9d9]">
          <p className="font-semibold text-white">{content.benefitTitle}</p>
          <p className="mt-2">{content.benefitDescription}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <BlurFade>
          <h2 className="font-serif text-3xl tracking-[0.12em]">{content.plansTitle}</h2>
        </BlurFade>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {content.plans.map((plan, index) => (
            <BlurFade
              key={plan.name}
              delay={0.06 * index}
              className={`border p-4 ${plan.highlight ? "border-white" : "border-[#999999]"}`}
            >
              <h3 className="text-xs tracking-[0.08em] text-[#d9d9d9]">{plan.name}</h3>
              <p className="mt-4 font-serif text-3xl">{plan.price}</p>
              <p className="mt-2 text-xs text-[#999999]">{plan.detail}</p>
            </BlurFade>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-serif text-3xl tracking-[0.12em]">{content.matrixTitle}</h2>
        <div className="mt-6 overflow-x-auto border border-[#999999]">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#111] text-xs uppercase tracking-[0.08em] text-[#d9d9d9]">
              <tr>
                <th className="px-3 py-3">{content.matrixHeaders.size}</th>
                <th className="px-3 py-3">{content.matrixHeaders.visitorExterior}</th>
                <th className="px-3 py-3">{content.matrixHeaders.visitorFull}</th>
                <th className="px-3 py-3">{content.matrixHeaders.subMonthly1}</th>
                <th className="px-3 py-3">{content.matrixHeaders.subMonthly2Exterior}</th>
                <th className="px-3 py-3">{content.matrixHeaders.subMonthly2Full}</th>
              </tr>
            </thead>
            <tbody>
              {content.matrixRows.map((row) => (
                <tr key={row.size} className="border-t border-[#999999] text-[#d9d9d9]">
                  <td className="px-3 py-3 text-white">{row.size}</td>
                  <td className="px-3 py-3">{row.visitorExterior}</td>
                  <td className="px-3 py-3">{row.visitorFull}</td>
                  <td className="px-3 py-3">{row.subMonthly1}</td>
                  <td className="px-3 py-3">{row.subMonthly2Exterior}</td>
                  <td className="px-3 py-3">{row.subMonthly2Full}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-[#999999]">{content.matrixNote}</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-serif text-3xl tracking-[0.12em]">{content.vehicleSizeTitle}</h2>
        <p className="mt-2 text-xs text-[#999999]">{content.vehicleSizeSubTitle}</p>
        <div className="mt-8 space-y-6">
          {content.sizeGroups.map((group) => (
            <article key={group.name} className="border-l border-[#999999] pl-4">
              <h3 className="text-lg font-semibold">{group.name} <span className="text-sm text-[#999999]">({group.multiplier})</span></h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm text-[#d9d9d9]">
                {group.cars.map((car) => (
                  <p key={car} className="border border-[#999999]/50 px-2 py-1">{car}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-xs text-[#999999]">{content.vehicleSizeNote}</p>
      </section>

      <section id="reservation-form" className="py-8">
        <AmanBookingForm />
      </section>

      <footer className="border-t border-[#999999] px-4 py-8 text-center text-xs tracking-[0.1em] text-[#999999]">{content.footer}</footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/<\/script>/gi, "<\\/script>") }} />
    </main>
  );
}
