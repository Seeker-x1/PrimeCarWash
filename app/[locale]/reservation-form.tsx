"use client";

import { FormEvent, useState } from "react";
import { Locale, siteContent } from "@/lib/site-content";

type Props = {
  locale: Locale;
};

export default function ReservationForm({ locale }: Props) {
  const content = siteContent[locale];
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      setStatus("success");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full border border-[#999999] bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input className={inputClass} name="name" placeholder={content.labels.name} required />
      <input className={inputClass} name="phone" placeholder={content.labels.phone} required />
      <input className={inputClass} name="vehicle" placeholder={content.labels.vehicle} required />
      <input
        className={inputClass}
        type="date"
        name="preferredDate1"
        aria-label={content.labels.preferredDate1}
        required
      />
      <input
        className={inputClass}
        type="date"
        name="preferredDate2"
        aria-label={content.labels.preferredDate2}
        required
      />
      <textarea
        className={inputClass}
        name="address"
        placeholder={content.labels.address}
        rows={3}
        required
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full border border-white px-6 py-3 text-xs tracking-[0.16em] uppercase hover:bg-white hover:text-black disabled:opacity-60"
      >
        {status === "sending" ? content.formMessages.sending : content.labels.submit}
      </button>

      {status === "success" ? (
        <p className="text-sm text-white">{content.formMessages.success}</p>
      ) : null}
      {status === "error" ? <p className="text-sm text-[#999999]">{content.formMessages.error}</p> : null}
    </form>
  );
}

