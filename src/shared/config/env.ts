export const ENV = {
  API_BASE: process.env.NEXT_PUBLIC_API_BASE ?? '',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  USE_MOCK: (process.env.NEXT_PUBLIC_USE_MOCK ?? 'false').toLowerCase() === 'true',
};
