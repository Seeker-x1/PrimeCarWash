import type { Locale } from "@/lib/site-content";
import { siteContent } from "@/lib/site-content";
import { getThreadsProfileUrl } from "@/lib/social-links";

type SiteFooterProps = {
  locale: Locale;
};

export default function SiteFooter({ locale }: SiteFooterProps) {
  const content = siteContent[locale];
  const threadsUrl = getThreadsProfileUrl();

  return (
    <footer className="border-t border-[#999999] px-4 py-8 text-center text-xs tracking-[0.1em] text-[#999999]">
      <p>{content.footer}</p>
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
    </footer>
  );
}
