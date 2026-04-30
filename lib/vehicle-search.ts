import type { Vehicle } from "@/constants/vehicles";

const brandAliases: Record<string, string[]> = {
  "\u30c8\u30e8\u30bf": ["toyota"],
  "\u65e5\u7523": ["nissan"],
  "\u30ec\u30af\u30b5\u30b9": ["lexus"],
  "\u30db\u30f3\u30c0": ["honda"],
  "\u30de\u30c4\u30c0": ["mazda"],
  "\u30b9\u30d0\u30eb": ["subaru"],
  "\u4e09\u83f1": ["mitsubishi"],
  "\u30b9\u30ba\u30ad": ["suzuki"],
  "\u30c0\u30a4\u30cf\u30c4": ["daihatsu"],
  "\u30e1\u30eb\u30bb\u30c7\u30b9\u30fb\u30d9\u30f3\u30c4": [
    "mercedes",
    "benz",
    "mercedes-benz",
  ],
  "\u30e9\u30f3\u30c9\u30ed\u30fc\u30d0\u30fc": [
    "land rover",
    "landrover",
    "range rover",
    "rangerover",
  ],
  "\u30dd\u30eb\u30b7\u30a7": ["porsche"],
  "\u30ad\u30e3\u30c7\u30e9\u30c3\u30af": ["cadillac"],
  "\u30e9\u30f3\u30dc\u30eb\u30ae\u30fc\u30cb": ["lamborghini"],
  "\u30d9\u30f3\u30c8\u30ec\u30fc": ["bentley"],
  "\u30ed\u30fc\u30eb\u30b9\u30ed\u30a4\u30b9": ["rolls royce", "rolls-royce"],
};

const modelAliases: Array<{ includes: string; aliases: string[] }> = [
  { includes: "\u30d7\u30ea\u30a6\u30b9", aliases: ["prius"] },
  { includes: "\u30d5\u30a7\u30a2\u30ec\u30c7\u30a3z", aliases: ["fairlady z", "fairladyz"] },
  { includes: "gt-r", aliases: ["gtr", "gt r"] },
  { includes: "\u30b9\u30ab\u30a4\u30e9\u30a4\u30f3", aliases: ["skyline"] },
  { includes: "\u30cf\u30a4\u30e9\u30c3\u30af\u30b9", aliases: ["hilux"] },
  {
    includes: "\u30e9\u30f3\u30c9\u30af\u30eb\u30fc\u30b6\u30fc",
    aliases: ["land cruiser", "landcruiser", "lc300", "lc250"],
  },
  { includes: "\u30a2\u30eb\u30d5\u30a1\u30fc\u30c9", aliases: ["alphard"] },
  { includes: "\u30f4\u30a7\u30eb\u30d5\u30a1\u30a4\u30a2", aliases: ["vellfire"] },
  { includes: "\u30cf\u30ea\u30a2\u30fc", aliases: ["harrier"] },
  { includes: "rav4", aliases: ["rav4"] },
  { includes: "\u30ce\u30a2", aliases: ["noah"] },
  { includes: "\u30f4\u30a9\u30af\u30b7\u30fc", aliases: ["voxy"] },
  { includes: "\u30bb\u30ec\u30ca", aliases: ["serena"] },
  { includes: "\u30a8\u30eb\u30b0\u30e9\u30f3\u30c9", aliases: ["elgrand"] },
  { includes: "g\u30af\u30e9\u30b9", aliases: ["g class", "g-class", "g wagon", "gelandewagen"] },
  { includes: "c\u30af\u30e9\u30b9", aliases: ["c class", "c-class"] },
  { includes: "e\u30af\u30e9\u30b9", aliases: ["e class", "e-class"] },
  { includes: "s\u30af\u30e9\u30b9", aliases: ["s class", "s-class"] },
  { includes: "gle", aliases: ["gle"] },
  { includes: "gls", aliases: ["gls"] },
  { includes: "rx", aliases: ["rx"] },
  { includes: "nx", aliases: ["nx"] },
  { includes: "ux", aliases: ["ux"] },
  { includes: "lx", aliases: ["lx"] },
];

const queryAliases: Array<{ queries: string[]; targets: string[] }> = [
  { queries: ["gr\u30e4\u30ea\u30b9", "gr yaris", "gryaris"], targets: ["\u30e4\u30ea\u30b9", "yaris"] },
  { queries: ["gr\u30ab\u30ed\u30fc\u30e9", "gr corolla", "grcorolla"], targets: ["\u30ab\u30ed\u30fc\u30e9", "corolla"] },
  { queries: ["\u30e9\u30f3\u30af\u30eb", "landcruiser"], targets: ["\u30e9\u30f3\u30c9\u30af\u30eb\u30fc\u30b6\u30fc", "land cruiser"] },
  { queries: ["g63", "amg g63", "amgg63"], targets: ["g\u30af\u30e9\u30b9", "g class"] },
  { queries: ["m3"], targets: ["3\u30b7\u30ea\u30fc\u30ba", "3 series"] },
  { queries: ["m4"], targets: ["4\u30b7\u30ea\u30fc\u30ba", "4 series"] },
  { queries: ["rs6"], targets: ["a6", "a6 / a7"] },
  { queries: ["rs7"], targets: ["a7", "a6 / a7"] },
];

export function normalizeVehicleSearchValue(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u2010-\u2015\u30fc\-_\s/\uff0f\u30fb,\u3001.\u3002()\uff08\uff09]/g, "");
}

export function getVehicleQueryVariants(value: string) {
  const normalized = normalizeVehicleSearchValue(value);
  if (!normalized) return [];

  const variants = new Set([normalized]);
  for (const rule of queryAliases) {
    const matches = rule.queries.some((query) =>
      normalized.includes(normalizeVehicleSearchValue(query)),
    );
    if (matches) {
      rule.targets.forEach((target) =>
        variants.add(normalizeVehicleSearchValue(target)),
      );
    }
  }

  return Array.from(variants);
}

export function buildVehicleSearchText(vehicle: Vehicle) {
  const jp = `${vehicle.brand} ${vehicle.model}`;
  const en = `${vehicle.brandEn ?? ""} ${vehicle.modelEn ?? ""}`;
  const base = `${jp} ${en}`.toLowerCase();
  const aliases: string[] = [];

  aliases.push(...(brandAliases[vehicle.brand] ?? []));

  for (const rule of modelAliases) {
    if (base.includes(rule.includes.toLowerCase())) {
      aliases.push(...rule.aliases);
    }
  }

  return `${base} ${aliases.join(" ")}`;
}
