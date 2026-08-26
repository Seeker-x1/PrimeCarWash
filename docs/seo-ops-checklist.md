# SEO 運用チェック（出張洗車.jp）

コード側で自動化できる項目は実装済み。Google アカウント操作だけ手元で残る。

| # | 項目 | 判定 | 実装 / 手順 |
|---|------|------|-------------|
| 1 | Search Console 登録・インデックスリクエスト | **運用（手動）** | プロパティは登録済み。サイトマップ再送信は下記 URL。新規URLは検査→インデックス登録。連打しない。 |
| 2 | GA4 イベント | **コードで対応** | `generate_lead`（LINE予約・相談・問い合わせ）と `click_line`。GA4 リアルタイムで確認。 |
| 3 | GoogleビジネスプロフィールにサイトURL | **運用（手動）** | ウェブサイト欄に `https://出張洗車.jp/` 。公開URLが取れたら `NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE_URL` を Vercel に入れる（JSON-LD `sameAs`）。 |
| 4 | サイトマップ送信 | **コード + 手動1回** | 本番: `https://xn--79q753awyk7z6a.jp/sitemap.xml` （`https://出張洗車.jp/sitemap.xml`）。GSC「サイトマップ」にこのフルURLを送信。 |
| 5 | スマホ実機 | **コードで予防 + 実機確認** | タップ 44px、iOS ズーム防止（input 16px）、viewport-fit。実機 Safari で予約フローを最終確認。 |
| 6 | 問い合わせ送信テスト 3回以上 | **API + LINE** | `/api/inquiry` は受付確認。本番コンバージョンは LINE 予約。3回は API テストで実施。 |
| 7 | PageSpeed Insights | **計測して改善** | 画像 AVIF/WebP。定期的にモバイルで再計測。 |

## Search Console に貼る URL

- サイトマップ: `https://xn--79q753awyk7z6a.jp/sitemap.xml`
- トップ: `https://xn--79q753awyk7z6a.jp/`
- エリア例: `https://xn--79q753awyk7z6a.jp/areas/shibuya`

`http://出張洗車.jp/` は HTTPS へ 308 する。これは正しいので、GSC の「ページにリダイレクトがあります」検証対象にしない。インデックスするのは `https://出張洗車.jp/` だけ。

## GBP

1. [ビジネスプロフィール](https://business.google.com) を開く
2. ウェブサイト: `https://出張洗車.jp/`
3. サービスエリア型（店舗住所は出さない）
4. 確認完了後、公開プロフィール URL を `NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE_URL` に設定
