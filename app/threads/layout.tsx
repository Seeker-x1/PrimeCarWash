import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Threads Ops",
  robots: { index: false, follow: false },
};

export default function ThreadsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
