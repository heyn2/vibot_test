import { NextResponse } from 'next/server';
export async function POST() {
  // TODO: CSRF/validation + pending 생성
  return NextResponse.json({ userId: 'stub', status: 'PENDING' }, { status: 201 });
}
