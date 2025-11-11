import http from '@/shared/lib/axios';

export type LoginBody = { email: string; password: string };
export type LoginResp = { ok: boolean };

export async function login(body: LoginBody) {
  const { data } = await http.post<LoginResp>('/auth/login', body);
  return data;
}
