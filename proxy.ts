import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function withLocaleHeaders(request: NextRequest, locale: "ja" | "en") {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-locale", locale);
  return requestHeaders;
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/ja";
    const response = NextResponse.rewrite(url, {
      request: { headers: withLocaleHeaders(request, "ja") },
    });
    response.cookies.set("site-locale", "ja", { path: "/" });
    return response;
  }

  if (path === "/ja" || path === "/ja/") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url, 308);
  }

  const locale = path.startsWith("/en") ? "en" : "ja";
  const response = NextResponse.next({
    request: { headers: withLocaleHeaders(request, locale) },
  });
  response.cookies.set("site-locale", locale, { path: "/" });
  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|sitemap.xml|robots.txt|api).*)"],
};
