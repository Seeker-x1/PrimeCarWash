# Threads 運営チーム — AI エージェント編成

**オーナー（あなた）**: 承認・実投稿・返信送信・撮影・例外判断  
**それ以外**: 下記5エージェントが担当（Cursor スキルとして実装）

## エージェント一覧

| エージェント | スキル名 | 主担当 |
|-------------|----------|--------|
| 編集長 | `threads-content-director` | 投稿企画・文面・バンク改善 |
| コミュニティ | `threads-community-manager` | 返信下書き・エンゲージ文・DM |
| 現場ストーリー | `threads-field-storyteller` | 施工ネタ・撮影指示・キャプション |
| Ops | `threads-ops` | Cron/投稿/API・障害調査 |
| 成長分析 | `threads-growth-analyst` | 週次KPI・改善提案 |
| 司令塔 | `threads-orchestrator` | 日次/週次ブリーフの統合 |

スキル配置: `.cursor/skills/threads-*/SKILL.md`

## 使い方（オーナー向け）

### 毎朝（5分）

Cursor で:

```
@threads-orchestrator 今日の運用ブリーフを出して
```

→ 本日の自動投稿予定・手動投稿案・返信タスク・撮影指示が1枚にまとまる。

### 個別に依頼する

```
@threads-content-director 来週7本の投稿案。local-authority 3、save-list 2、follow-value 1
```

```
@threads-community-manager このコメントへの返信3案: 「世田谷でも来れますか？」
```

```
@threads-field-storyteller 今日の施工メモ: 目黒区マンション、黒いSUV、ホイール重点。キャプションと撮影リスト
```

```
@threads-ops 自動投稿が止まってる。本番を調査して
```

```
@threads-growth-analyst 週次レポート。フォロワー120、保存多かった投稿は save-03
```

### 投稿を本番に出す（オーナー操作）

1. エージェントが文面を確定
2. `/threads` を開く → **AIで生成** またはバンク確認 → **Publish today**
3. 現場写真付きは Threads アプリから手動投稿（キャプションはエージェント案をコピー）

## 週次サイクル

| 曜日 | エージェント | 成果物 |
|------|-------------|--------|
| 月 | orchestrator + content-director | 週間テーマ表（7本） |
| 水 | growth-analyst | 週次レポート（`templates/weekly-report.md`） |
| 金 | content-director + ops | バンク見直し（delete 候補リスト） |
| 日 | content-director | follow-value 投稿1本 |

## 成果物の置き場

| 種類 | パス |
|------|------|
| 共有コンテキスト | `docs/threads-agents/CONTEXT.md` |
| 返信テンプレ | `docs/threads-agents/templates/reply-templates.md` |
| 週次レポート雛形 | `docs/threads-agents/templates/weekly-report.md` |
| 日次ブリーフ雛形 | `docs/threads-agents/templates/daily-brief.md` |

## コード変更が必要なとき

- バンク追加・修正 → `threads-content-director` が案を出し、オーナー承認後に `lib/threads/content.ts` を編集
- Cron/投稿不具合 → `threads-ops` が調査・修正PR案

詳細ルール: 各スキルの `SKILL.md` を参照。
