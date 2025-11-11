import http from '@/shared/lib/axios';
import { ENV } from '@/shared/config/env';
import { delay } from '@/shared/lib/delay';

export type RegisterBody = {
  email: string;
  password: string;
  name: string;
  termsAgree: boolean;
};

export type RegisterResp = { userId: string; status: 'PENDING' };

export async function register(body: RegisterBody) {
  if (ENV.USE_MOCK) {
    await delay();
    return { userId: 'mock-user', status: 'PENDING' } satisfies RegisterResp;
  }
  const { data } = await http.post<RegisterResp>('/auth/register', body);
  return data;
}
