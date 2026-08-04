# Threads 運用 — 共有コンテキスト（全エージェント共通）

オーナー以外の運用は AI エージェントが担う。オーナーは **承認・投稿実行・最終判断** のみ。

## 目標（30日）

| KPI | 目標 |
|-----|------|
| フォロワー | **1,000**（現状〜数名から） |
| 純増ペース | 約33人/日（後半加速） |
| 投稿 | 自動1本/日 + 手動1本/日 |
| 返信 | コメント・DMは24h以内（下書きはエージェント、送信はオーナー） |

## ブランド

- **PRIME CAR WASH** — プレミアム出張洗車（モバイルベレッティング）
- トーン: 静か・上質・売り込み控えめ。詩的コピー・ブローシャー調は禁止
- 中心エリア: 渋谷区・世田谷区・目黒区（港・品川・中野など対応例）
- エリアLP（日本語）: `/areas/shibuya` `/areas/setagaya` `/areas/meguro` `/areas/minato` `/areas/shinagawa` `/areas/nakano`（英語は `/en/areas/{slug}`）
- 予約導線: サイト `https://www.xn--79q753awyk7z6a.jp/` / LINE `[WEB相談]`
- アカウント: `@primecarwashjapan`

## コンテンツ原則

| やる | やらない |
|------|----------|
| 1行目フック（問い・数字・断言） | 抽象ブランドコピーだけ |
| 具体エリア・シーン | 全国どこでも通じる一般論だけ |
| エリア特化テーマでは区別LP（`/areas/{slug}`）を1本に1〜2リンク | リンクなしの地域名だけ |
| 保存リスト・チェックリスト | 連続宣伝・割引煽り |
| 最後に質問（返信誘導） | 一方的な会社案内 |
| 月1〜2の「フォロー価値」投稿 | 毎日ハードCTA |

## 技術（エージェントが参照）

| 用途 | パス / URL |
|------|------------|
| 投稿バンク・テーマ | `lib/threads/content.ts` |
| エリアLP URL ヘルパー | `lib/threads/area-links.ts`（`lib/area-pages.ts` と連動） |
| Ops UI | `/threads`（要 `THREADS_PUBLISH_SECRET`） |
| 自動投稿 | Cron → `GET /api/threads/cron` |
| 手動投稿 | `POST /api/threads/publish` |
| 差し替え・AI生成 | `POST /api/threads/refresh`（`forceGenerate`） |
| 詳細 | `docs/threads-posting.md` |
| プロフィール | `docs/threads-account.md` |

## 人間（オーナー）が必ずやること

1. Threads アプリでの **実投稿・返信送信**（エージェントは下書きのみ）
2. 現場写真・動画の **撮影**
3. 炎上・クレーム・料金例外の **最終判断**
4. `THREADS_PUBLISH_SECRET` 等の **秘密情報の保持**（チャットに貼らない）

## テーマ ID 一覧

`local-authority` `myth-bust` `save-list` `relatable` `process-proof` `hot-take` `faq-engage` `seasonal-tips` `owner-insight` `follow-value`
