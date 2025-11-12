import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const refreshClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<void> | null = null;

const ensureRefresh = () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/auth/refresh')
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const handleUnauthorized = () => {
  if (typeof window !== 'undefined') {
    window.location.assign('/login');
  }
};

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const { response } = error;
    const requestConfig = error.config as RetryableRequestConfig | undefined;

    if (!response || !requestConfig || response.status !== 401 || requestConfig._retry) {
      throw error;
    }

    try {
      await ensureRefresh();
      requestConfig._retry = true;
      return http(requestConfig);
    } catch (refreshError) {
      handleUnauthorized();
      throw refreshError;
    }
  },
);

export default http;
