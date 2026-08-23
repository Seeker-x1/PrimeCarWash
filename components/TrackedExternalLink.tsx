"use client";

import type { ReactNode } from "react";
import { trackGenerateLead, trackLineClick } from "@/lib/analytics";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  location: string;
  trackLead?: boolean;
};

export default function TrackedExternalLink({
  href,
  className,
  children,
  location,
  trackLead = false,
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        trackLineClick(location);
        if (trackLead) {
          trackGenerateLead({ method: "line_consult" });
        }
      }}
    >
      {children}
    </a>
  );
}
