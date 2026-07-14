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
| `/threads` | Ops UI（noindex・シークレットで解錠） |

Cron スケジュール: `0 1 * * *`（UTC）= **毎日 10:00 JST**

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
3. 本日分のプレビュー → Dry-run / Publish

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
  -d '{"postId":"bw-01","dryRun":false}' \
  https://YOUR_DOMAIN/api/threads/publish
```

## 投稿の追加・編集

`lib/threads/content.ts` の `THREADS_POSTS` に追加:

- `id` はユニーク
- `themeId` は `THREADS_THEMES` に存在
- `text` は **500 文字以内**
- 休みたい投稿は `enabled: false`

日付ごとの割当は DB なし（通算日 % 有効投稿数）。投稿を足すとローテーション間隔が伸びる。

## 注意

- 同一日に Cron が再実行されると同文が再度選ばれる（冪等な「投稿済み」記録は未実装）。必要なら後続で KV / Blob に `lastPostedDate` を保存する
- `/threads` は公開 URL だが secret 必須・noindex。本番では Basic Auth や IP 制限を足してもよい
- LINE 導線へのハードセルは避け、ブランドトーン（静か・上質）を維持する
