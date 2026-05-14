/** 初回6,000円案内用・LINE送信欄に入れる文面（QRは短いURLからリダイレクトして同じ内容を開く） */
export const LINE_SHOKAI_FIRST_MESSAGE = `【初回6,000円】ありがとうございます。

初回洗車6,000円でのご案内になります。
お手数ですが、以下①〜④にご記入のうえ、送信してください。

①ご希望日時（第2希望まで）
②車種
③洗車場所
④お電話番号

確認後、担当よりご連絡します。
PRIME CAR WASH`;

const LINE_OFFICIAL_ID =
  process.env.NEXT_PUBLIC_LINE_OFFICIAL_ID ?? "@834ecayh";

export function getLineShokaiFirstUrl(): string {
  return `https://line.me/R/oaMessage/${LINE_OFFICIAL_ID}/?${encodeURIComponent(
    LINE_SHOKAI_FIRST_MESSAGE,
  )}`;
}
