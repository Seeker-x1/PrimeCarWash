# Threads 自動投稿

PRIME CAR WASH 向け。テーマ＋投稿バンクをコードで管理し、Vercel Cron / 手動 API / Ops 画面から Threads に投稿する。

## 構成

| パス | 役割 |
|------|------|
| `lib/threads/content.ts` | テーマ定義 + 投稿本文バンク |
| `lib/threads/schedule.ts` | JST 日付で決定的に本日分を選択 |
| `lib/threads/client.ts` | Threads Graph API（container → publish） |
| `GET /api/threads/preview` | キュー確認（要シークレット） |
| `POST /api/threads/publish` | 手動投稿（要シークレット） |
| `GET /api/threads/cron` | 日次自動投稿（Vercel Cron） |
| `POST /api/threads/refresh` | 指定日の投稿文を別案に差し替え（`forceGenerate` で AI 強制） |
| `lib/threads/resolve-post.ts` | バンク + 日付オーバーライド（AI 生成含む）を Publish 用に解決 |
| `/threads` | Ops UI（noindex・シークレットで解錠） |

Cron スケジュール（Hobby 対応）: 毎日 JST 8時・12時・13時台にチェック（13時台は取りこぼし救済）。
定刻を逃した日は窓内の次の Cron で1回だけ追いかけ。窓は `THREADS_POST_WINDOW_START` / `END`（既定 8–14＝8〜13時台）。

> Hobby プランは「1日1回」の Cron のみ。毎時 Cron はデプロイ失敗するため、窓内の各時に daily Cron を並べています。

### 気に入らない投稿の削除（繰り上げ）

`/threads` の **delete** / **Delete today** でローテーションから外すと、以降の日付の予定が繰り上がります（元の本文は `lib/threads/content.ts` に残り、restore 可能）。

本番で削除を残すには **Vercel Blob** が必要です。

1. Vercel → Storage → Blob ストア作成  
2. プロジェクトに `BLOB_READ_WRITE_TOKEN` が付く（自動が多い）  
3. Redeploy  

ローカル開発は `data/threads-disabled.json` に保存（gitignore）。

### 投稿文の refresh（差し替え）と AI 無限生成

| Ops UI | 動作 |
|--------|------|
| **別の案** | 投稿バンクの未使用候補に差し替え。枯渇後は自動で Gemini 生成 |
| **AIで生成** | バンクをスキップし、毎回 Gemini で新規文面（`forceGenerate`） |
| **再読込** | 画面表示のみ更新（投稿文は変わらない） |

1. まず投稿バンクの未使用候補から選ぶ（「別の案」）
2. バンクを使い切ったら **Gemini（`GEMINI_API_KEY`）で新規生成**
3. **「AIで生成」** はバンクに関係なく何度でも新規生成できる

記録: Vercel Blob `threads/date-overrides.json`（削除キューと同じストア）

### 投稿済みの日に追加投稿

- **Cron は1日1回**（`posted-dates.json` でスキップ）
- **手動 Publish は回数制限なし**。投稿済みでも「AIで生成」→「Publish today」で追加投稿できる
- AI 生成文（`gen-*` ID）は日付オーバーライドに保存。`resolve-post.ts` 経由で Publish 可能
- `POST /api/threads/publish` に `date`（JST `YYYY-MM-DD`）を渡すと、その日の差し替え文を投稿

```bash
# 今日の差し替え文を AI で生成
curl -s -X POST -H "Authorization: Bearer $THREADS_PUBLISH_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-07-31","forceGenerate":true}' \
  https://YOUR_DOMAIN/api/threads/refresh

# 追加投稿（投稿済みでも可）
curl -s -X POST -H "Authorization: Bearer $THREADS_PUBLISH_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"postId":"gen-...","date":"2026-07-31","dryRun":false}' \
  https://YOUR_DOMAIN/api/threads/publish
```

## Meta 側の準備

1. [Meta for Developers](https://developers.facebook.com/) でアプリ作成 → **Threads API** を追加
2. 権限: `threads_basic`, `threads_content_publish`
3. Threads アカウントを連携し、長期アクセストークンと User ID を取得
4. App Review（本番公開）が必要な場合あり。開発モードではテストユーザーのみ

公式フローは 2 ステップ:

1. `POST https://graph.threads.net/v1.0/{user-id}/threads`（`media_type=TEXT` + `text`）
2. `POST https://graph.threads.net/v1.0/{user-id}/threads_publish`（`creation_id`）

## 環境変数（Vercel / `.env.local`）

```
THREADS_USER_ID=
THREADS_ACCESS_TOKEN=
THREADS_PUBLISH_SECRET=   # Ops UI / 手動 API 用（必須）
CRON_SECRET=              # Vercel が Cron に付ける Bearer。未設定なら THREADS_PUBLISH_SECRET のみで可
THREADS_DRY_RUN=true      # トークン無し/検証時。本番投稿前は false または削除
THREADS_CRON_ENABLED=false # 一時停止したいとき
```

- トークン未設定、または `THREADS_DRY_RUN=true` のときは **実投稿せず dry-run**（ログ用レスポンスのみ）
- `THREADS_PUBLISH_SECRET` も `CRON_SECRET` も無いと API は 503

## 使い方

### Ops UI

1. 本番またはローカルで `/threads` を開く
2. `THREADS_PUBLISH_SECRET` を入力
3. 本日分のプレビュー → **AIで生成** / **別の案** → Dry-run / Publish（投稿済みでも追加投稿可）

### curl

```bash
# プレビュー
curl -s -H "Authorization: Bearer $THREADS_PUBLISH_SECRET" \
  https://YOUR_DOMAIN/api/threads/preview | jq

# 本日分を dry-run
curl -s -X POST -H "Authorization: Bearer $THREADS_PUBLISH_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"dryRun":true}' \
  https://YOUR_DOMAIN/api/threads/publish

# 特定 ID を本番投稿
curl -s -X POST -H "Authorization: Bearer $THREADS_PUBLISH_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"postId":"loc-01","dryRun":false}' \
  https://YOUR_DOMAIN/api/threads/publish
```

## 投稿の追加・編集

`lib/threads/content.ts` の `THREADS_POSTS` に追加:

- `id` はユニーク
- `themeId` は `THREADS_THEMES` に存在
- `text` は **500 文字以内**
- 休みたい投稿は `enabled: false`

日付ごとの割当は DB なし（通算日 % 有効投稿数）。投稿を足すとローテーション間隔が伸びる。

### コンテンツ方針（フォロワー獲得）

自動投稿だけでフォロワーは増えにくい。以下を守る:

| やる | やらない |
|------|----------|
| 1行目にフック（問い・数字・断言） | 詩的なブランドコピーだけ |
| 渋谷・世田谷・目黒など具体エリア | どこでも通じる抽象文だけ |
| 保存できるチェックリスト | 宣伝文の連投 |
| 最後に質問（返信・議論を誘う） | 一方的な会社案内 |
| 月1〜2本の「フォロー価値」投稿 | 毎日の硬い CTA |

**1000フォロワーまでの運用:**

1. 自動投稿は「認知の土台」。伸びるのは手動の返信・引用・エリア系の反応
2. `/threads` で反応の悪い投稿は delete → ローテーションから外す
3. 週1は手動で「今日の施工」「質問への回答」を1本足す
4. プロフィールにエリア・予約導線を明記（`docs/threads-account.md`）

テーマ ID 一覧: `local-authority` `myth-bust` `save-list` `relatable` `process-proof` `hot-take` `faq-engage` `seasonal-tips` `owner-insight` `follow-value`

### 取りこぼし（catch-up）

Vercel Hobby では Cron が予定時刻に間に合わないことがあります。  
そのため **投稿窓内（既定 JST 8–12）で、当日まだ出していなければ次の Cron で1回だけ追いかけ**ます。

- 記録: Vercel Blob `threads/posted-dates.json`（削除キューと同じ Blob ストア）
- 手動 Publish も当日分として記録し、同日の自動追いかけを防ぐ（**手動の追加投稿はブロックしない**）
- Blob 未設定の本番では追いかけは無効。**投稿予定時刻は Cron と同じ 8 / 12 / 13 時 JST に自動限定**（9〜11 時にずれると Hobby では投稿されない）
- Blob を接続すると任意時刻＋取りこぼし追いかけが有効

## 注意

- ~~同一日に Cron が再実行されると同文が再度選ばれる~~ → 投稿済み日は `posted-dates.json` でスキップ
- `/threads` は公開 URL だが secret 必須・noindex。本番では Basic Auth や IP 制限を足してもよい
- LINE 導線へのハードセルは避ける。売り込みより「役立つ情報＋質問」でフォロー理由を作る
