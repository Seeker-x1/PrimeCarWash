import { NextResponse } from "next/server";

type InquiryPayload = {
  name?: string;
  phone?: string;
  vehicle?: string;
  preferredDate1?: string;
  preferredDate2?: string;
  address?: string;
};

export async function POST(request: Request) {
  let payload: InquiryPayload;
  try {
    payload = (await request.json()) as InquiryPayload;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const requiredFields: Array<keyof InquiryPayload> = [
    "name",
    "phone",
    "vehicle",
    "preferredDate1",
    "preferredDate2",
    "address",
  ];

  const missing = requiredFields.filter((field) => !payload[field]?.trim());
  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, message: "Missing required fields.", missing },
      { status: 400 },
    );
  }

  const MAX_LENGTH = 500;
  const tooLong = requiredFields.some(
    (field) => (payload[field]?.length ?? 0) > MAX_LENGTH,
  );
  if (tooLong) {
    return NextResponse.json(
      { ok: false, message: "Field is too long." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
