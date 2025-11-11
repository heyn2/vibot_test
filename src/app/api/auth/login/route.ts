import { NextResponse } from 'next/server';

type LoginPayload = { email?: string; password?: string };

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as LoginPayload;

  if (!body.email || !body.password) {
    return NextResponse.json({ ok: false, reason: 'INVALID_CREDENTIALS' }, { status: 400 });
  }

  // TODO: 실제 인증 로직 연결
  return NextResponse.json({ ok: true }, { status: 200 });
}
