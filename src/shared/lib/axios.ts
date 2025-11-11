import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {};
    if (!response || !config) throw error;

    if (response.status === 401 && !config._retry) {
      if (isRefreshing) {
        await new Promise<void>((resolve) => pendingQueue.push(resolve));
      } else {
        isRefreshing = true;
        try {
          await http.post('/auth/refresh');
          pendingQueue.forEach((fn) => fn());
        } catch (e) {
          throw error;
        } finally {
          isRefreshing = false;
          pendingQueue = [];
        }
      }

      config._retry = true;
      return http(config);
    }
    throw error;
  },
);

export default http;
