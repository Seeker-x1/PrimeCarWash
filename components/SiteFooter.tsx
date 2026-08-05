import Link from "next/link";
import type { Locale } from "@/lib/site-content";
import { siteContent } from "@/lib/site-content";
import { areaSlugs, getAreaCanonicalPath, getAreaPage } from "@/lib/area-pages";
import { getAreasHubPath, getGuideCanonicalPath, getGuidePost, getGuidesHubPath, guideSlugs } from "@/lib/guide-posts";
import { getThreadsProfileUrl } from "@/lib/social-links";

type SiteFooterProps = {
  locale: Locale;
};

export default function SiteFooter({ locale }: SiteFooterProps) {
  const content = siteContent[locale];
  const threadsUrl = getThreadsProfileUrl();
  const homeHref = locale === "ja" ? "/" : "/en";
  const primaryAreas = areaSlugs.filter((slug) => getAreaPage(slug)?.isPrimary).slice(0, 3);
  const moreAreas = areaSlugs.filter((slug) => !getAreaPage(slug)?.isPrimary).slice(0, 6);

  return (
    <footer className="border-t border-[#999999] px-4 py-10 text-center text-xs tracking-[0.1em] text-[#999999]">
      <nav aria-label={locale === "ja" ? "サイト内リンク" : "Site links"} className="mx-auto max-w-6xl text-left">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#666]">
              {locale === "ja" ? "対応エリア" : "Areas"}
            </p>
            <ul className="mt-3 space-y-2">
              {primaryAreas.map((slug) => {
                const area = getAreaPage(slug)!;
                const label = locale === "ja" ? area.wardJa : area.wardEn;
                return (
                  <li key={slug}>
                    <Link href={getAreaCanonicalPath(locale, slug)} className="hover:text-white">
                      {label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link href={getAreasHubPath(locale)} className="hover:text-white">
                  {locale === "ja" ? "エリア一覧 →" : "All areas →"}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#666]">
              {locale === "ja" ? "その他エリア" : "More areas"}
            </p>
            <ul className="mt-3 space-y-2">
              {moreAreas.map((slug) => {
                const area = getAreaPage(slug)!;
                const label = locale === "ja" ? area.wardJa : area.wardEn;
                return (
                  <li key={slug}>
                    <Link href={getAreaCanonicalPath(locale, slug)} className="hover:text-white">
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#666]">
              {locale === "ja" ? "ガイド" : "Guides"}
            </p>
            <ul className="mt-3 space-y-2">
              {guideSlugs.slice(0, 4).map((slug) => {
                const post = getGuidePost(slug)!;
                const label = locale === "ja" ? post.ja.h1 : post.en.h1;
                return (
                  <li key={slug}>
                    <Link href={getGuideCanonicalPath(locale, slug)} className="hover:text-white">
                      {label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link href={getGuidesHubPath(locale)} className="hover:text-white">
                  {locale === "ja" ? "ガイド一覧 →" : "All guides →"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <p className="mt-10">{content.footer}</p>
      <p className="mt-4">
        <a
          href={threadsUrl}
          target="_blank"
          rel="me noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[#999999] px-4 py-2 tracking-[0.12em] text-[#d9d9d9] hover:border-white hover:text-white"
        >
          {content.threadsLinkLabel}
        </a>
      </p>
      <p className="mt-4">
        <Link href={`${homeHref}#reservation-form`} className="text-[#d9d9d9] hover:text-white">
          {content.ctaReserve}
        </Link>
      </p>
    </footer>
  );
}
