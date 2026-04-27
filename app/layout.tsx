import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import Script from "next/script";
import { cookies } from "next/headers";
import LineFloat from "@/components/LineFloat";
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
  metadataBase: new URL("https://primecarwash.vercel.app"),
  title: {
    default: "PRIME CAR WASH",
    template: "%s | PRIME CAR WASH",
  },
  description:
    "Premium mobile valeting service with subscription plans for exterior and interior care.",
  alternates: {
    languages: {
      ja: "/ja",
      en: "/en",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("site-locale")?.value;
  const lang = localeCookie === "en" ? "en" : "ja";
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
