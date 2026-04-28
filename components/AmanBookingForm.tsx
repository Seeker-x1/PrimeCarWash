"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import BlurFade from "@/components/BlurFade";
import VehicleSelector from "@/components/VehicleSelector";
import { CarSize } from "@/constants/vehicles";

type ChoiceSlot = {
  date: string;
  slot: string;
  plan: string;
};

type CalendarDay = {
  iso: string;
  label: number;
  isCurrentMonth: boolean;
};

const PLAN_OPTIONS = [
  { id: "visitor-exterior", label: "ビジター：ボディ洗車", price: 7700 },
  { id: "visitor-full", label: "ビジター：ボディ洗車＋内装清掃", price: 9900 },
  { id: "sub-1", label: "継続プラン：月1回ボディ洗車", price: 6600 },
  { id: "sub-2", label: "継続プラン：月2回ボディ洗車", price: 11000 },
  { id: "sub-2-full", label: "継続プラン：月2回ボディ洗車＋内装清掃", price: 15400 },
];

const TIME_SLOTS = [
  "8:00 - 10:00",
  "10:00 - 12:00",
  "13:00 - 15:00",
  "16:00 - 18:00",
];
const SIZE_MULTIPLIER: Record<CarSize, number> = {
  M: 1.0,
  L: 1.2,
  LL: 1.4,
  XL: 1.8,
};
const LINE_OFFICIAL_ID =
  process.env.NEXT_PUBLIC_LINE_OFFICIAL_ID ?? "@834ecayh";

function formatDate(date: string) {
  if (!date) return "";
  const dt = new Date(`${date}T00:00:00`);
  return Number.isNaN(dt.getTime())
    ? date
    : dt.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
      });
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarDays(baseDate: Date): CalendarDay[] {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();

  const startDate = new Date(year, month, 1 - startOffset);
  const days: CalendarDay[] = [];

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push({
      iso: toIsoDate(date),
      label: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
    });
  }

  return days;
}

export default function AmanBookingForm() {
  const [selectedPlanId, setSelectedPlanId] = useState(PLAN_OPTIONS[0].id);
  const [selectedVehicleSize, setSelectedVehicleSize] = useState<CarSize | null>(
    null,
  );
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [activeDate, setActiveDate] = useState<string>("");
  const [slotSelections, setSlotSelections] = useState<Record<string, string[]>>({});
  const [firstChoice, setFirstChoice] = useState<ChoiceSlot | null>(null);
  const [secondChoice, setSecondChoice] = useState<ChoiceSlot | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [lineUrl, setLineUrl] = useState("");
  const [selectedVehicleName, setSelectedVehicleName] = useState("");

  const selectedPlan = useMemo(
    () => PLAN_OPTIONS.find((plan) => plan.id === selectedPlanId) ?? PLAN_OPTIONS[0],
    [selectedPlanId],
  );
  const handleVehicleChange = useCallback(
    (value: {
      vehicle: { brand: string; model: string } | null;
      size: CarSize | null;
      query: string;
    }) => {
      setSelectedVehicleSize(value.size);
      setSelectedVehicleName(
        value.vehicle
          ? `${value.vehicle.brand} ${value.vehicle.model}`
          : value.query.trim(),
      );
    },
    [],
  );
  const multiplier = selectedVehicleSize ? SIZE_MULTIPLIER[selectedVehicleSize] : 1.0;
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const currentMonthDays = buildCalendarDays(currentMonthDate);
  const nextMonthDays = buildCalendarDays(nextMonthDate);

  const activeSlots = activeDate ? slotSelections[activeDate] ?? [] : [];
  const activeDateIndex = selectedDates.findIndex((date) => date === activeDate);
  const canSetFirstChoice = activeDateIndex === 0 && activeSlots.length > 0;
  const canSetSecondChoice = activeDateIndex === 1 && activeSlots.length > 0;
  const totalPrice = Math.round(selectedPlan.price * multiplier);
  const canConfirm = Boolean(firstChoice || secondChoice);

  const outlineButton =
    "border border-[#999999] px-4 py-3 text-xs tracking-[0.12em] uppercase text-white transition hover:border-white";
  const selectedButton = "border border-white bg-white px-4 py-3 text-xs tracking-[0.12em] uppercase text-black";

  const handleReservation = () => {
    const firstChoiceText = firstChoice
      ? `${formatDate(firstChoice.date)} ${firstChoice.slot.replaceAll(" / ", ", ")}`
      : "未選択";
    const secondChoiceText = secondChoice
      ? `${formatDate(secondChoice.date)} ${secondChoice.slot.replaceAll(" / ", ", ")}`
      : "未選択（第1希望のみで調整希望）";
    const sizeText = selectedVehicleSize
      ? `${selectedVehicleSize}サイズ`
      : "未選択";
    const vehicleText = selectedVehicleName || "未選択";

    const message = `[WEB予約]
【プライム出張洗車 予約リクエスト】
■ 車種: ${vehicleText}
■ 車両サイズ: ${sizeText}
■ ご希望プラン: ${selectedPlan.label}

■ 第1希望
${firstChoiceText}

■ 第2希望
${secondChoiceText}

■ 合計金額
JPY ${totalPrice.toLocaleString()}`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://line.me/R/oaMessage/${LINE_OFFICIAL_ID}/?${encodedMessage}`;
    const isMobile =
      typeof window !== "undefined" &&
      (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        window.innerWidth <= 768);

    if (isMobile) {
      window.open(url, "_blank");
      return;
    }

    setLineUrl(url);
    setShowQRModal(true);
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 text-white">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <BlurFade>
            <h1 className="font-serif text-3xl tracking-[0.12em]">ご予約情報入力</h1>
          </BlurFade>
          <p className="mt-3 text-sm text-[#999999]">
            プラン選択後に日付と時間帯を選択してください。必要な情報だけを段階的に表示します。
          </p>

          <BlurFade delay={0.04} className="mt-8">
            <h2 className="text-xs tracking-[0.14em] uppercase text-[#999999]">
              STEP 0 - 車種選択
            </h2>
            <div className="mt-3">
              <VehicleSelector
                onChange={handleVehicleChange}
              />
            </div>
            <p className="mt-2 text-xs text-[#999999]">
              {selectedVehicleSize
                ? `選択サイズ: ${selectedVehicleSize}`
                : "車種を検索してサイズを自動判定してください"}
            </p>
          </BlurFade>

          <BlurFade delay={0.08} className="mt-8">
            <h2 className="text-xs tracking-[0.14em] uppercase text-[#999999]">STEP 1 - プラン選択</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {PLAN_OPTIONS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const adjustedPrice = Math.round(plan.price * multiplier);
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={isSelected ? selectedButton : outlineButton}
                  >
                    <span className="block">{plan.label}</span>
                    <span className="mt-1 block text-[11px] opacity-70">¥{adjustedPrice.toLocaleString()}</span>
                  </button>
                );
              })}
            </div>
          </BlurFade>

          <BlurFade delay={0.14} className="mt-8">
            <h2 className="text-xs tracking-[0.14em] uppercase text-[#999999]">STEP 2 - 日付選択</h2>
            <p className="mt-2 text-xs text-[#999999]">
              {selectedDates.length > 0
                ? `選択中: ${selectedDates.map((date) => formatDate(date)).join(" / ")}`
                : "今月と来月のカレンダーから希望日を2つまで選択してください"}
            </p>
            <div className="mt-4 grid gap-5 lg:grid-cols-2">
              {[
                { title: currentMonthDate, days: currentMonthDays },
                { title: nextMonthDate, days: nextMonthDays },
              ].map((monthData) => (
                <div key={`${monthData.title.getFullYear()}-${monthData.title.getMonth()}`} className="border border-[#999999] p-3">
                  <p className="mb-3 text-sm tracking-[0.08em]">
                    {monthData.title.toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                  <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-[#777]">
                    {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {monthData.days.map((day) => {
                      const dayDate = new Date(`${day.iso}T00:00:00`);
                      const dateIndex = selectedDates.indexOf(day.iso);
                      const isSelected = dateIndex !== -1;
                      const isPrimaryDate = dateIndex === 0;
                      const isSecondaryDate = dateIndex === 1;
                      const isToday = isSameDay(dayDate, today);
                      const isPast = dayDate < todayStart;

                      return (
                        <button
                          key={`${monthData.title.getMonth()}-${day.iso}`}
                          type="button"
                          disabled={isPast}
                          onClick={() => {
                            if (isPast) return;
                            if (isSelected) {
                              setActiveDate(day.iso);
                              return;
                            }
                            setSelectedDates((prev) => {
                              if (prev.length < 2) {
                                const next = [...prev, day.iso];
                                setActiveDate(day.iso);
                                return next;
                              }
                              const replacement = [prev[0], day.iso];
                              setActiveDate(day.iso);
                              setSlotSelections((current) => ({
                                ...current,
                                [day.iso]: [],
                              }));
                              return replacement;
                            });
                          }}
                          className={`relative h-9 border text-xs transition ${
                            isPrimaryDate
                              ? "border-white bg-white text-black"
                              : isSecondaryDate
                                ? "border-[#999999] bg-[#555555] text-white"
                              : isPast
                                ? "cursor-not-allowed border-transparent text-[#3f3f3f]"
                              : day.isCurrentMonth
                                ? "border-transparent text-white hover:border-white/60"
                                : "border-transparent text-[#555] hover:border-white/30"
                          }`}
                        >
                          {day.label}
                          {isToday ? (
                            <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#06C755]" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </BlurFade>

          <AnimatePresence>
            {activeDate ? (
              <BlurFade delay={0.2} className="mt-8">
                <h2 className="text-xs tracking-[0.14em] uppercase text-[#999999]">STEP 3 - 時間帯選択</h2>
                <p className="mt-2 text-xs text-[#999999]">
                  {activeDateIndex === 0
                    ? `第1希望日 ${formatDate(activeDate)} を編集中（白）`
                    : `第2希望日 ${formatDate(activeDate)} を編集中（グレー）`}
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = activeSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() =>
                          setSlotSelections((prev) => {
                            const currentSlots = prev[activeDate] ?? [];
                            const nextSlots = currentSlots.includes(slot)
                              ? currentSlots.filter((value) => value !== slot)
                              : [...currentSlots, slot];
                            return { ...prev, [activeDate]: nextSlots };
                          })
                        }
                        className={
                          isSelected
                            ? activeDateIndex === 0
                              ? selectedButton
                              : "border border-[#999999] bg-[#555555] px-4 py-3 text-xs tracking-[0.12em] uppercase text-white"
                            : outlineButton
                        }
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={!canSetFirstChoice}
                    onClick={() =>
                      setFirstChoice({
                        date: activeDate,
                        slot: activeSlots.join(" / "),
                        plan: selectedPlan.label,
                      })
                    }
                    className={`rounded-full border px-5 py-3 text-xs tracking-[0.12em] uppercase transition ${
                      canSetFirstChoice
                        ? "border-white bg-white text-black"
                        : "border-[#555] text-[#777]"
                    }`}
                  >
                    第1希望に設定
                  </button>
                  <button
                    type="button"
                    disabled={!canSetSecondChoice}
                    onClick={() =>
                      setSecondChoice({
                        date: activeDate,
                        slot: activeSlots.join(" / "),
                        plan: selectedPlan.label,
                      })
                    }
                    className={`rounded-full border px-5 py-3 text-xs tracking-[0.12em] uppercase transition ${
                      canSetSecondChoice
                        ? "border-[#999999] bg-[#555555] text-white"
                        : "border-[#555] text-[#777]"
                    }`}
                  >
                    第2希望に設定
                  </button>
                </div>
              </BlurFade>
            ) : null}
          </AnimatePresence>
        </div>

        <aside className="lg:col-span-2">
          <div className="top-24 border border-[#999999] p-6 lg:sticky">
            <h2 className="font-serif text-3xl leading-none tracking-[0.08em]">選択内容</h2>

            <div className="mt-6 space-y-4">
              <div className="border border-[#999999] p-4">
                <p className="text-[11px] tracking-[0.12em] uppercase text-[#999999]">第1希望</p>
                <AnimatePresence mode="wait">
                  {firstChoice ? (
                    <motion.div
                      key={`first-${firstChoice.date}-${firstChoice.slot}-${firstChoice.plan}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="mt-2 text-sm"
                    >
                      <p>{formatDate(firstChoice.date)}</p>
                      <p className="text-[#d4d4d4]">{firstChoice.slot}</p>
                      <p className="text-[#d4d4d4]">{firstChoice.plan}</p>
                    </motion.div>
                  ) : (
                    <p className="mt-2 text-sm text-[#999999]">希望日時を選択してください</p>
                  )}
                </AnimatePresence>
              </div>

              <div className="border border-[#999999] p-4">
                <p className="text-[11px] tracking-[0.12em] uppercase text-[#999999]">第2希望</p>
                <AnimatePresence mode="wait">
                  {secondChoice ? (
                    <motion.div
                      key={`second-${secondChoice.date}-${secondChoice.slot}-${secondChoice.plan}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="mt-2 text-sm"
                    >
                      <p>{formatDate(secondChoice.date)}</p>
                      <p className="text-[#d4d4d4]">{secondChoice.slot}</p>
                      <p className="text-[#d4d4d4]">{secondChoice.plan}</p>
                    </motion.div>
                  ) : (
                    <p className="mt-2 text-sm text-[#999999]">希望日時を選択してください</p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-8 border-t border-[#999999] pt-5">
              <p className="text-[11px] tracking-[0.12em] uppercase text-[#999999]">合計金額</p>
              <p className="mt-2 font-serif text-3xl">JPY {totalPrice.toLocaleString()}</p>
              <button
                type="button"
                onClick={handleReservation}
                disabled={!canConfirm}
                className="mt-5 w-full rounded-full border border-white bg-transparent px-5 py-3 text-xs tracking-[0.16em] uppercase text-white transition hover:bg-white hover:text-black disabled:border-[#555] disabled:text-[#777]"
              >
                CONFIRM VIA LINE
              </button>
              <p className="mt-2 text-xs text-[#999999]">
                ※クリックするとLINEが起動します。PCをご利用の方は、表示されるQRコードをスマートフォンで読み取って送信してください。
              </p>
            </div>
          </div>
        </aside>
      </div>

      {showQRModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          onKeyDown={(e) => e.key === "Escape" && setShowQRModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="LINE QRコード"
            className="w-full max-w-sm border border-white/20 bg-[#0a0a0a] p-6 text-center"
          >
            <p className="mb-5 text-sm text-[#d4d4d4]">
              スマートフォンのカメラで読み取ってご予約を完了してください
            </p>
            <div className="flex justify-center">
              <QRCodeSVG
                value={lineUrl}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                marginSize={4}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowQRModal(false)}
              className="mt-6 w-full border border-white/20 px-4 py-2 text-xs tracking-[0.14em] uppercase text-white transition hover:bg-white hover:text-black"
            >
              閉じる
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
