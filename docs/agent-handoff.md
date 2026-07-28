# PRIME CAR WASH — エージェント用指示書（コピペ用）

更新: 2026-06-20
リポジトリ: Seeker-x1/PrimeCarWash（ローカル: primecarwash-site/）
Vercel: prime-car-wash

---

## 使い方

別ウィンドウのエージェントに、このファイル全文を貼り付ける。
依存更新・デプロイ・POP/LINE・Vercel 設定を触る前に必ず読むこと。

---

## あなたへの指示

あなたは PRIME CAR WASH 公式サイト（Next.js LP + 予約/LINE 導線）の開発エージェント。
プレミアム出張洗車のブランドサイト。ダーク・ミニマル、スマホ優先、日英（/ja /en）。

### 必ず守ること

1. Vercel / CI の install は npm ci のみ。npm install に変更しない。
2. vercel.json と .github/**/*.yml は UTF-8（BOM なし）で保存。PowerShell の > / Out-File デフォルトは使わない。
3. next / react / eslint-config-next は 16.2.9 / 19.2.7 をセット維持（Skiresort フリートと同ライン）。勝手に major 跨ぎ bump しない。
4. POP_PROMO_SECRET をソースに書かない。フォールバック PRM-POP-6000 は削除済み。復活禁止。
5. .env.local と秘密値を commit しない。GEMINI_API_KEY はサーバー専用。
6. 依頼範囲外の大規模リファクタ禁止。変更後は npm run lint / npm run build を可能なら実行。

### 作業前チェック

依存更新・セキュリティ PR:
- next / react / eslint-config-next を同版で揃える
- npm ci → npm audit --audit-level=high → npm run lint → npm run build
- package.json と package-lock.json をセット commit
- 設定ファイルが UTF-8 か確認

POP / LINE 変更:
- POP_PROMO_SECRET フォールバックを復活させない
- Vercel Production に POP_PROMO_SECRET が設定済みか確認（未設定ならオーナーに提醒）
- 証明コード変更時は LINE OA キーワードも更新

---

## 直近の変更（2026-06）

60002a1 — next 16.2.6 / react 19.2.6（CVE-2026-23870 初回パッチ）
（以降）16.2.9 / 19.2.7 にフリート統一
86cd1f6 — vercel.json を UTF-8 化（UTF-16 が Invalid vercel.json の原因）
47f6f9a — dependabot.yml を UTF-8 化
4113c2b — POP_PROMO_SECRET 必須化（コード内 PRM-POP-6000 削除）

---

## 環境変数

NEXT_PUBLIC_SITE_URL
  用途: カノニカル・sitemap・OG・JSON-LD の origin（lib/site-url.ts）
  推奨: 本番 Vercel に明示（例: https://www.xn--79q753awyk7z6a.jp）
  未設定時: VERCEL_PROJECT_PRODUCTION_URL → VERCEL_URL → www 出張洗車.jp フォールバック
  注意: Preview デプロイで sitemap ホストがプレビュー URL になるのを防ぐため本番は明示設定推奨

GEMINI_API_KEY
  用途: 車種サイズ API（app/api/classify-vehicle/route.ts）
  必須: classify 利用時 / サーバーのみ / クライアント露出禁止

NEXT_PUBLIC_GA_MEASUREMENT_ID
  用途: GA4 / 任意

NEXT_PUBLIC_LINE_OFFICIAL_ID
  用途: LINE 公式 ID / 推奨 / 未設定時 @834ecayh フォールバックあり

POP_PROMO_SECRET
  用途: 店頭 POP 証明コード（/line-pop）
  必須: 本番 Vercel 必須 / 未設定時 /line-pop は 503（意図的）
  運用: LINE キーワード維持なら Vercel に POP_PROMO_SECRET=PRM-POP-6000 を env で設定
  注意: 値変更時は LINE Official Account Manager のキーワード応答も更新

THREADS_USER_ID / THREADS_ACCESS_TOKEN
  用途: Threads Graph API 投稿（container → publish）
  任意: 未設定時は dry-run（実投稿しない）

THREADS_PUBLISH_SECRET
  用途: /api/threads/* と /threads Ops UI の認可
  推奨: 自動投稿を使うなら必須（未設定時 API は 503）

CRON_SECRET
  用途: Vercel Cron の Bearer（THREADS_PUBLISH_SECRET でも可）

詳細: docs/threads-posting.md

---

## Google 検索（Search Console）

技術 SEO（robots / sitemap / メタ / JSON-LD）はリポジトリ側で整備済み。検索掲載には登録が必要。

### リダイレクトについて（登録できないとき）

本番の正規 URL は **`https://www.出張洗車.jp`**（punycode: `https://www.xn--79q753awyk7z6a.jp`）のみ。

| 入力した URL | 結果 |
|-------------|------|
| `http://出張洗車.jp` | → https へ 308 |
| `https://出張洗車.jp`（www なし） | → **www** へ 308 |
| `https://www.出張洗車.jp` | **200（ここを登録）** |

GSC に **`https://出張洗車.jp` だけ**を入れると「リダイレクトがある」と拒否される。**www 付き**で登録するか、下記ドメインプロパティを使う。

### 登録手順（推奨 2 択）

**A. URL プレフィックス（手早い）**

1. [Search Console](https://search.google.com/search-console) → プロパティを追加
2. 次を**そのまま**入力: `https://www.出張洗車.jp`（末尾スラッシュ有無はどちらでも可）
3. 所有権確認: HTML タグ（`app/layout.tsx` に meta 追加可）/ DNS / Vercel 連携
4. Sitemaps → `https://www.xn--79q753awyk7z6a.jp/sitemap.xml` を送信
5. URL 検査で `/` と `/en` → インデックス登録をリクエスト

**B. ドメインプロパティ（www 有無を気にしない・推奨）**

1. プロパティタイプ: **ドメイン** → `出張洗車.jp`（または `xn--79q753awyk7z6a.jp`）
2. ドメイン管理画面に Google の **TXT レコード**を追加して確認
3. http/https・apex/www すべてが 1 プロパティに含まれる

補足: `/f` `/l` `/reserve` `/ja/pop` `/en/pop` は noindex / robots Disallow。LP 本体のみインデックス対象。

---

## 店頭 POP 導線

フロー: /ja/pop → /line-pop?lang=ja|en → LINE 事前入力（302）→ LINE OA キーワード応答

関連ファイル:
- app/[locale]/pop/page.tsx
- app/line-pop/route.ts（secret 未設定で 503）
- lib/pop-page-content.ts

別導線（POP secret 非使用）: /f , /l

---

## よく触るパス

LP 本体: app/[locale]/page.tsx
レイアウト・GA4: app/layout.tsx
予約フォーム: components/AmanBookingForm.tsx（LINE は [WEB予約] プレフィックス）
車種検索: components/VehicleSelector.tsx , constants/vehicles.ts
フローティング LINE: components/LineFloat.tsx
LINE 相談 URL: lib/line-consultation.ts（[WEB相談] / [WEB CONSULTATION]）
文言辞書: lib/site-content.ts（ja/en 両方必須）
車両 API: app/api/classify-vehicle/route.ts
問い合わせ API: app/api/inquiry/route.ts

---

## 標準コマンド

npm ci
npm audit --audit-level=high
npm run lint
npm run build

---

## トラブルシュート

Invalid vercel.json → UTF-16 化。UTF-8（BOM なし）で書き直し再デプロイ。
/line-pop が 503 → Vercel に POP_PROMO_SECRET 未設定。Environment Variables に追加。
Security audit CI 失敗 → npm audit で High 特定 → パッチ版 bump。
Dependabot PR 失敗 → lock 整合 + YAML が UTF-8 か確認。

---

## オーナー確認（未確認なら提醒）

- Vercel Production に POP_PROMO_SECRET が設定されているか
- LINE キーワード応答が secret 値と一致しているか

---

## 参考（リポジトリ内）

AGENTS.md — プロジェクト文脈
docs/threads-posting.md — Threads 自動投稿（テーマ / Cron / API）
docs/web-prompts/ — Web 構築プロンプト 1–9
.cursor/rules/primecarwash-context.mdc — Cursor 常時ルール
docs/web-prompts/ — Web 構築プロンプト
Cloude ルート docs/security/ — 横断セキュリティレポート（本リポ単体には docs/security/ なし）
