import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import Script from "next/script";
import { cookies, headers } from "next/headers";
import LineFloat from "@/components/LineFloat";
import { getSiteOrigin } from "@/lib/site-url";
import "./globals.css";

const notoSans = Noto_Sans_JP({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const notoSerif = Noto_Serif_JP({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: {
    default: "PRIME CAR WASH",
    template: "%s | PRIME CAR WASH",
  },
  description:
    "完全予約制の出張洗車。ご指定の洗車場所へ伺い、車外・車内を丁寧にケア。ビジター・月額プランあり。",
  alternates: {
    languages: {
      "x-default": "/",
      ja: "/",
      en: "/en",
    },
  },
};

function resolveHtmlLang(
  headerLocale: string | null,
  cookieLocale: string | undefined,
): "ja" | "en" {
  if (headerLocale === "en" || headerLocale === "ja") return headerLocale;
  if (cookieLocale === "en") return "en";
  return "ja";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const lang = resolveHtmlLang(
    headerStore.get("x-site-locale"),
    cookieStore.get("site-locale")?.value,
  );
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang={lang} className={`${notoSans.variable} ${notoSerif.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        {children}
        <LineFloat />
      </body>
      {gaMeasurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-script" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}');
            `}
          </Script>
        </>
      ) : null}
    </html>
  );
}
