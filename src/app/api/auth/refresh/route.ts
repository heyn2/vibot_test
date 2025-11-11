import { NextResponse } from 'next/server';
export async function POST() {
  // TODO: RTR 로직으로 새 토큰 발급
  return new NextResponse(null, { status: 204 });
}
