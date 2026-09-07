import type { NextConfig } from "next";
import path from "path";
import { HSTS_HEADER_VALUE } from "./lib/site-url";

const hstsHeaders = [
  {
    key: "Strict-Transport-Security",
    value: HSTS_HEADER_VALUE,
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qr-official.line.me",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/",
        headers: hstsHeaders,
      },
      {
        source: "/:path*",
        headers: hstsHeaders,
      },
    ];
  },
};

export default nextConfig;
