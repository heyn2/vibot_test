import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // TODO: 실제 인증 + 세션 로직 구현
  // 개발용 스텁: 항상 성공 가정
  return NextResponse.json({ ok: true }, { status: 200 });
}
