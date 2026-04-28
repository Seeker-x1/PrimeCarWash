"use client";

import { useEffect, useMemo, useState } from "react";
import { CarSize, Vehicle, vehicles } from "@/constants/vehicles";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type VehicleSelectorValue = {
  mode: "auto" | "manual";
  vehicle: Vehicle | null;
  size: CarSize | null;
  query: string;
};

type VehicleSelectorProps = {
  onChange?: (value: VehicleSelectorValue) => void;
};

const manualSizes: CarSize[] = ["M", "L", "LL", "XL"];

const brandAliases: Record<string, string[]> = {
  "トヨタ": ["toyota"],
  "日産": ["nissan"],
  "レクサス": ["lexus"],
  "ホンダ": ["honda"],
  "マツダ": ["mazda"],
  "スバル": ["subaru"],
  "三菱": ["mitsubishi"],
  "スズキ": ["suzuki"],
  "ダイハツ": ["daihatsu"],
  "メルセデス・ベンツ": ["mercedes", "benz", "mercedes-benz"],
  "ランドローバー": ["land rover", "landrover", "range rover", "rangerover"],
  "ポルシェ": ["porsche"],
  "キャデラック": ["cadillac"],
  "ランボルギーニ": ["lamborghini"],
  "ベントレー": ["bentley"],
  "ロールスロイス": ["rolls royce", "rolls-royce"],
};

const modelAliases: Array<{ includes: string; aliases: string[] }> = [
  { includes: "プリウス", aliases: ["prius"] },
  { includes: "フェアレディz", aliases: ["fairlady z", "fairladyz"] },
  { includes: "gt-r", aliases: ["gtr", "gt r"] },
  { includes: "スカイライン", aliases: ["skyline"] },
  { includes: "ハイラックス", aliases: ["hilux"] },
  { includes: "ランドクルーザー", aliases: ["land cruiser", "landcruiser", "lc300", "lc250"] },
  { includes: "アルファード", aliases: ["alphard"] },
  { includes: "ヴェルファイア", aliases: ["vellfire"] },
  { includes: "ハリアー", aliases: ["harrier"] },
  { includes: "rav4", aliases: ["rav4"] },
  { includes: "ノア", aliases: ["noah"] },
  { includes: "ヴォクシー", aliases: ["voxy"] },
  { includes: "セレナ", aliases: ["serena"] },
  { includes: "エルグランド", aliases: ["elgrand"] },
  { includes: "gクラス", aliases: ["g class", "g-class", "g wagon", "gelandewagen"] },
  { includes: "cクラス", aliases: ["c class", "c-class"] },
  { includes: "eクラス", aliases: ["e class", "e-class"] },
  { includes: "sクラス", aliases: ["s class", "s-class"] },
  { includes: "gle", aliases: ["gle"] },
  { includes: "gls", aliases: ["gls"] },
  { includes: "rx", aliases: ["rx"] },
  { includes: "nx", aliases: ["nx"] },
  { includes: "ux", aliases: ["ux"] },
  { includes: "lx", aliases: ["lx"] },
];

function buildSearchText(vehicle: Vehicle) {
  const jp = `${vehicle.brand} ${vehicle.model}`;
  const en = `${vehicle.brandEn ?? ""} ${vehicle.modelEn ?? ""}`;
  const base = `${jp} ${en}`.toLowerCase();
  const aliases: string[] = [];

  const brandExtra = brandAliases[vehicle.brand] ?? [];
  aliases.push(...brandExtra);

  for (const rule of modelAliases) {
    if (base.includes(rule.includes.toLowerCase())) {
      aliases.push(...rule.aliases);
    }
  }

  return `${base} ${aliases.join(" ")}`;
}

export default function VehicleSelector({ onChange }: VehicleSelectorProps) {
  const [query, setQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedSize, setSelectedSize] = useState<CarSize | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredVehicles = useMemo(() => {
    if (!normalizedQuery) return [];
    return vehicles.filter((vehicle) =>
      buildSearchText(vehicle).includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  useEffect(() => {
    onChange?.({
      mode: manualMode ? "manual" : "auto",
      vehicle: selectedVehicle,
      size: selectedSize,
      query,
    });
  }, [manualMode, onChange, query, selectedSize, selectedVehicle]);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setManualMode(false);
    setAiMessage(null);
    setSelectedVehicle(vehicle);
    setSelectedSize(vehicle.size);
    setQuery(`${vehicle.brand} ${vehicle.model}`);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setAiMessage(null);

    const selectedLabel = selectedVehicle
      ? `${selectedVehicle.brand} ${selectedVehicle.model}`
      : "";

    if (selectedVehicle && value === selectedLabel) return;

    setSelectedVehicle(null);
    setSelectedSize(null);
    setManualMode(false);
  };

  const handleAiClassify = async () => {
    if (!normalizedQuery) return;
    setAiLoading(true);
    setAiMessage(null);

    try {
      const response = await fetch("/api/classify-vehicle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carName: query.trim() }),
      });

      if (!response.ok) {
        throw new Error("AI classify request failed");
      }

      const data = (await response.json()) as {
        size?: CarSize;
        source?: "local" | "ai";
        matchedVehicle?: string;
      };
      if (!data.size || !manualSizes.includes(data.size)) {
        throw new Error("Invalid size returned");
      }

      setSelectedVehicle(null);
      setSelectedSize(data.size);
      setManualMode(false);
      setAiMessage(
        data.source === "local" && data.matchedVehicle
          ? `登録済み車両「${data.matchedVehicle}」から判定しました。`
          : "AI判定によりサイズを設定しました。",
      );
    } catch {
      setAiMessage("AI判定に失敗しました。手動でサイズを選択してください。");
      setSelectedVehicle(null);
      setSelectedSize(null);
      setManualMode(true);
    } finally {
      setAiLoading(false);
    }
  };

  const noResults = normalizedQuery.length > 0 && filteredVehicles.length === 0;
  const shouldShowAiButton =
    noResults && normalizedQuery.length >= 2 && !selectedSize && !manualMode;

  return (
    <div className="space-y-3">
      <div className="rounded-[6px] border border-[#999999] bg-black">
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={handleQueryChange}
            placeholder="車名を入力（例：プリウス / Gクラス）"
          />
          <CommandList>
            <CommandEmpty>
              {normalizedQuery
                ? "候補が見つかりません"
                : "車名を入力すると候補が表示されます"}
            </CommandEmpty>
            <CommandGroup>
              {filteredVehicles.map((vehicle) => (
                <CommandItem
                  key={`${vehicle.brand}-${vehicle.model}`}
                  value={`${vehicle.brand} ${vehicle.model} ${vehicle.brandEn ?? ""} ${vehicle.modelEn ?? ""}`}
                  onSelect={() => handleVehicleSelect(vehicle)}
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="truncate">
                      {vehicle.brand} / {vehicle.model}
                    </span>
                    <span className="text-xs text-[#999999]">SIZE {vehicle.size}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>

      {shouldShowAiButton ? (
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleAiClassify}
            disabled={aiLoading}
            className="w-full rounded-[6px] border border-[#999999] px-3 py-2 text-xs text-white transition hover:border-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {aiLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                AIで判定中...
              </span>
            ) : (
              `「${query.trim()}」のサイズをAIで自動判定する`
            )}
          </button>
        </div>
      ) : null}

      {aiMessage ? <p className="text-xs text-[#999999]">{aiMessage}</p> : null}

      <div className="flex items-center gap-2 text-xs text-[#999999]">
        <span>判定サイズ:</span>
        <span className="rounded-[6px] border border-[#999999] px-2 py-1 text-white">
          {selectedSize ?? "--"}
        </span>
      </div>

      {manualMode ? (
        <div className="space-y-2">
          <p className="text-xs text-[#999999]">手動サイズ選択（フォールバック）</p>
          <select
            value={selectedSize ?? ""}
            onChange={(event) => setSelectedSize(event.target.value as CarSize)}
            className="w-full rounded-[6px] border border-[#999999] bg-black px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">サイズを選択</option>
            {manualSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
