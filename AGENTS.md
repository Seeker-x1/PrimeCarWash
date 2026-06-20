# PRIME CAR WASH — エージェント向けプロジェクト文脈

このリポジトリは **プレミアム出張洗車（モバイルベレッティング）** の公式サイト（LP＋予約導線）です。Bugatti 系のダーク・ミニマルなビジュアル、**スマホ優先**、**日英（`/ja` `/en`）** が前提です。

## 技術スタック

- Next.js（App Router）+ TypeScript + Tailwind CSS
- Framer Motion（ヒーロー周り、`BlurFade`、`LineFloat`、予約フォームのアニメーション等）
- 主要コンテンツ: `lib/site-content.ts`（`Locale` ごとの辞書）

## 重要パス（よく触る場所）

| 領域 | パス |
|------|------|
| LP 本体 | `app/[locale]/page.tsx` |
| レイアウト・フォント・GA4 | `app/layout.tsx` |
| Aman 風予約フォーム | `components/AmanBookingForm.tsx` |
| 車種検索・サイズ | `components/VehicleSelector.tsx`、`constants/vehicles.ts` |
| フローティング LINE | `components/LineFloat.tsx`（`app/layout.tsx` で全ページ） |
| LINE 相談 URL 共通化 | `lib/line-consultation.ts` |
| 車両サイズ API | `app/api/classify-vehicle/route.ts` |
| 簡易問い合わせ API | `app/api/inquiry/route.ts` |

## i18n

- ルート: `/ja` `/en`。`/` は `/ja` へリダイレクト想定。
- 文言追加・変更は **`siteContent` に ja/en 両方** を入れる。

## LINE

- 公式 ID は `NEXT_PUBLIC_LINE_OFFICIAL_ID`（未設定時はコード内フォールバックあり）。
- 相談導線の事前入力メッセージ先頭: 日本語 **`[WEB相談]`**、英語 **`[WEB CONSULTATION]`**（`lib/line-consultation.ts`）。LINE 側の自動応答は **キーワード一致** で両方拾えるようにする。
- 予約フォームからの LINE は `[WEB予約]` プレフィックス（`AmanBookingForm.tsx`）。

## 環境変数・秘密情報

- `.env.local` は **Git に含めない**。必須変数一覧は **`docs/agent-handoff.md` §4**。
- `GEMINI_API_KEY` は **サーバー専用**（`classify-vehicle`）。クライアントに漏らさない。
- **`POP_PROMO_SECRET`** は店頭 POP 導線（`/line-pop`）専用。**Vercel 必須**。ソースにフォールバック値を書かない（未設定時 503）。詳細は **`docs/agent-handoff.md` §5**。

## セキュリティ・デプロイ（2026-06 更新）

- **Next.js 16.2.6** / React 19.2.6 — CVE-2026-23870 パッチ済み。勝手に major/minor 跨ぎ bump しない。
- Vercel / CI は **`npm ci` のみ**（`vercel.json` の `installCommand`）。lock 更新時のみローカル `npm install`。
- `.github/workflows/security-audit.yml` が PR/push で `npm audit --audit-level=high`。
- **`vercel.json` / `.github/*.yml` は UTF-8（BOM なし）必須**。UTF-16 化すると Vercel / Dependabot が壊れる。
- 変更内容・チェックリスト・POP 運用: **`docs/agent-handoff.md`** を読むこと。

## 店頭 POP 導線（`/ja/pop` → `/line-pop`）

- 証明コードは env `POP_PROMO_SECRET` のみ。LINE Official Account のキーワード応答と **同じ値** を Vercel に設定。
- `/f`・`/l` は別の初回 6,000 円導線（POP secret 非使用）。

## デザイン・作業方針

- 高級感のある抑えた配色（黒・白・グレー、LINE 緑はアクセントに限定）。
- 依頼範囲外のリファクタや無関係ファイルの編集はしない。
- 変更後は可能なら `npm run lint` / `npm run build`。

## Web 構築プロンプト（1–9）

ゼロからのサイト設計テンプレは **`docs/web-prompts/`** に同梱（`web-prompts-1-9.md`、`Get-WebPrompt.ps1`）。

## Next.js バージョン注意

<!-- BEGIN:nextjs-agent-rules -->
このリポジトリの Next.js は、学習データ上の「一般的な Next」と挙動・API が異なる場合があります。必要に応じて `node_modules/next/dist/docs/` 周辺のガイドを参照し、非推奨に注意してください。
<!-- END:nextjs-agent-rules -->
