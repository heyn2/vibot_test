import http from '@/shared/lib/axios';

export type RegisterBody = {
  email: string;
  password: string;
  name: string;
  termsAgree: boolean;
};

export type RegisterResp = { userId: string; status: 'PENDING' };

export async function register(body: RegisterBody) {
  const { data } = await http.post<RegisterResp>('/auth/register', body);
  return data;
}
