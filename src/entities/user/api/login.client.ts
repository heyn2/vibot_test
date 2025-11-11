import http from '@/shared/lib/axios';
import { ENV } from '@/shared/config/env';
import { delay } from '@/shared/lib/delay';

export type LoginBody = { email: string; password: string };
export type LoginResp = { ok: boolean };

export async function login(body: LoginBody) {
  if (ENV.USE_MOCK) {
    await delay();
    // 간단한 예: 비밀번호가 'fail'이면 실패로 가정
    if (body.password === 'fail') throw new Error('INVALID_CREDENTIALS');
    return { ok: true } satisfies LoginResp;
  }
  const { data } = await http.post<LoginResp>('/auth/login', body);
  return data;
}
