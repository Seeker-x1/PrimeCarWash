type GaParam = string | number | boolean;

declare global {
  interface Window {
    gtag?: (command: "event" | "config" | "js" | "set", ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  name: string,
  params?: Record<string, GaParam>,
): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

export type LeadMethod =
  | "line_reservation"
  | "line_consult"
  | "inquiry_form";

/** GA4 recommended event: form / LINE lead. */
export function trackGenerateLead(params: {
  method: LeadMethod;
  value?: number;
}): void {
  trackEvent("generate_lead", {
    method: params.method,
    currency: "JPY",
    ...(params.value != null ? { value: params.value } : {}),
  });
}

export function trackLineClick(location: string): void {
  trackEvent("click_line", {
    event_category: "engagement",
    event_label: location,
  });
}
