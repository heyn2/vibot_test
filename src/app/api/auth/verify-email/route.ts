import { NextResponse } from 'next/server';
export async function POST() {
  // TODO: 이메일 토큰 검증
  return new NextResponse(null, { status: 204 });
}
