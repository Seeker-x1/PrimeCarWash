/**
 * Threads 投稿の事実表現ルール。
 * 科学的根拠・出典のない断定（期限・メカニズム・数値効果）は禁止。
 */

export const FACTUAL_TONE_PROMPT_RULES = `- 事実・因果は「〜しやすい」「〜ことが多い」「現場では〜」など体験ベースの表現にする
- 次は禁止: 根拠のない期限（例: 72時間、48時間が分水嶺）、未検証の化学メカニズムの断定（ペクチンがクリア層を引き裂く等）、誇張（クレーター、塗装が歪む、確率がグッと下がる）
- 数字を使う場合は、自社の実測・公表研究・メーカー資料など出典があるときだけ。なければ数字を使わない
- 業界のよくある話（花粉・雨ジミ等）も、研究論文レベルの断定はしない
- 1行目のフックも、偽の精密さ（科学的に証明済み風）にしない`;

type ViolationRule = { pattern: RegExp; label: string };

const VIOLATION_RULES: ViolationRule[] = [
  { pattern: /72\s*時間/, label: "根拠のない72時間ルール" },
  { pattern: /48\s*時間.*(以内|が|で)/, label: "根拠のない48時間ルール" },
  { pattern: /24\s*[〜～-]\s*48\s*時間/, label: "根拠のない24〜48時間ルール" },
  { pattern: /分水嶺/, label: "偽の精密さ（分水嶺）" },
  { pattern: /クレーター/, label: "誇張表現（クレーター）" },
  { pattern: /塗装が歪/, label: "誇張表現（塗装が歪む）" },
  { pattern: /クリア層を.*(引き裂|歪|破)/, label: "未検証のクリア層ダメージ断定" },
  { pattern: /ペクチン.*(引き裂|歪|収縮させ|クリア層)/, label: "未検証のペクチン作用断定" },
  { pattern: /確率を.*(グッと|大幅|劇的)/, label: "根拠のない確率表現" },
  { pattern: /科学的(に|的)に(証明|実証)/, label: "根拠のない科学断定" },
  { pattern: /2倍しんど/, label: "根拠のない倍数表現" },
];

/** 事実表現ルール違反のラベル一覧（空なら OK） */
export function findFactualViolations(text: string): string[] {
  const hits = new Set<string>();
  for (const { pattern, label } of VIOLATION_RULES) {
    if (pattern.test(text)) hits.add(label);
  }
  return [...hits];
}

export function assertFactualPostText(text: string, context = "post"): void {
  const violations = findFactualViolations(text);
  if (violations.length === 0) return;
  throw new Error(
    `${context}: 科学的根拠のない断定表現があります — ${violations.join("、")}`,
  );
}
