import Link from "next/link";
import { SITE_NAME, SITE_NAME_ALT } from "@/lib/site-brand";

type SiteBrandLinkProps = {
  href: string;
};

/** ヘッダー用。公式名をドメイン、PRIME CAR WASH は補足。 */
export default function SiteBrandLink({ href }: SiteBrandLinkProps) {
  return (
    <Link href={href} className="hover:text-[#d9d9d9]">
      <span className="font-mono text-xs tracking-[0.12em]">{SITE_NAME}</span>
      <span className="ml-2 font-mono text-[10px] tracking-[0.16em] text-[#999999]">
        {SITE_NAME_ALT}
      </span>
    </Link>
  );
}
