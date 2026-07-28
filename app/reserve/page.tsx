import type { Metadata } from "next";
import AmanBookingForm from "@/components/AmanBookingForm";

export const metadata: Metadata = {
  title: "Reserve",
  description: "Luxury-style two-column booking form for PRIME CAR WASH.",
  robots: { index: false, follow: false },
};

export default function ReservePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <AmanBookingForm headingLevel="h1" />
    </main>
  );
}
