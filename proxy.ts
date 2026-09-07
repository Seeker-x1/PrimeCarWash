import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { HSTS_HEADER_VALUE, IDN_APEX_HOST, isWwwHost } from "@/lib/site-url";

function withLocaleHeaders(request: NextRequest, locale: "ja" | "en") {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-locale", locale);
  return requestHeaders;
}

function withHsts(response: NextResponse) {
  response.headers.set("Strict-Transport-Security", HSTS_HEADER_VALUE);
  return response;
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (isWwwHost(host)) {
    const dest = new URL(request.url);
    dest.protocol = "https:";
    dest.hostname = IDN_APEX_HOST;
    dest.port = "";
    return withHsts(NextResponse.redirect(dest, 308));
  }

  const path = request.nextUrl.pathname;
  if (path === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/ja";
    const response = NextResponse.rewrite(url, {
      request: { headers: withLocaleHeaders(request, "ja") },
    });
    response.cookies.set("site-locale", "ja", { path: "/" });
    return withHsts(response);
  }

  if (path.startsWith("/areas/")) {
    const url = request.nextUrl.clone();
    url.pathname = `/ja${path}`;
    const response = NextResponse.rewrite(url, {
      request: { headers: withLocaleHeaders(request, "ja") },
    });
    response.cookies.set("site-locale", "ja", { path: "/" });
    return withHsts(response);
  }

  if (path === "/areas") {
    const url = request.nextUrl.clone();
    url.pathname = "/ja/areas";
    const response = NextResponse.rewrite(url, {
      request: { headers: withLocaleHeaders(request, "ja") },
    });
    response.cookies.set("site-locale", "ja", { path: "/" });
    return withHsts(response);
  }

  if (path.startsWith("/guides/")) {
    const url = request.nextUrl.clone();
    url.pathname = `/ja${path}`;
    const response = NextResponse.rewrite(url, {
      request: { headers: withLocaleHeaders(request, "ja") },
    });
    response.cookies.set("site-locale", "ja", { path: "/" });
    return withHsts(response);
  }

  if (path === "/guides") {
    const url = request.nextUrl.clone();
    url.pathname = "/ja/guides";
    const response = NextResponse.rewrite(url, {
      request: { headers: withLocaleHeaders(request, "ja") },
    });
    response.cookies.set("site-locale", "ja", { path: "/" });
    return withHsts(response);
  }

  if (path.startsWith("/ja/areas/") || path === "/ja/areas") {
    const url = request.nextUrl.clone();
    url.pathname = path.replace(/^\/ja/, "");
    return withHsts(NextResponse.redirect(url, 308));
  }

  if (path.startsWith("/ja/guides/") || path === "/ja/guides") {
    const url = request.nextUrl.clone();
    url.pathname = path.replace(/^\/ja/, "");
    return withHsts(NextResponse.redirect(url, 308));
  }

  if (path === "/ja" || path === "/ja/") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return withHsts(NextResponse.redirect(url, 308));
  }

  const locale = path.startsWith("/en") ? "en" : "ja";
  const response = NextResponse.next({
    request: { headers: withLocaleHeaders(request, locale) },
  });
  response.cookies.set("site-locale", locale, { path: "/" });
  return withHsts(response);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|sitemap.xml|robots.txt|api).*)"],
};
