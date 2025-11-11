import http from '@/shared/lib/axios';
import { ENV } from '@/shared/config/env';
import { delay } from '@/shared/lib/delay';

// 서버 전송용 Body (BE 스펙)
export type LoginBody = {
  email: string;
  password: string;
};

// 프론트 전용 옵션 (서버로 보내지 않음)
export type LoginOptions = {
  remember?: boolean;
};

export async function login(body: LoginBody, opts: LoginOptions = {}) {
  // 🔹 Mock 모드 (개발용)
  if (ENV.USE_MOCK) {
    await delay(400);

    if (body.password === 'fail') {
      throw new Error('Invalid credentials');
    }

    // remember 옵션은 클라이언트 전용이므로 localStorage 등에서 처리 가능
    if (opts.remember) {
      localStorage.setItem('remember', 'true');
    } else {
      localStorage.removeItem('remember');
    }

    return { ok: true, remember: !!opts.remember };
  }

  // 🔹 실제 서버 호출 (email/password만 보냄)
  const res = await http.post('/auth/login', body, {
    // 나중에 BE가 remember를 헤더/쿼리로 요구하면 아래 주석 해제
    // params: opts.remember ? { remember: 1 } : undefined,
    // headers: opts.remember ? { "X-Session-Persist": "true" } : undefined,
  });

  return res.data;
}
