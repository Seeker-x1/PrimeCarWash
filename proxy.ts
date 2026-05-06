import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/ja";
    return NextResponse.rewrite(url);
  }

  const locale = path.startsWith("/en") ? "en" : "ja";

  const response = NextResponse.next();
  response.cookies.set("site-locale", locale, { path: "/" });
  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|sitemap.xml|robots.txt|api).*)"],
};
