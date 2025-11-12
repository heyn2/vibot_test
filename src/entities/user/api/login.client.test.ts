import { afterEach, describe, expect, it, vi } from 'vitest';

const createLocalStorageMock = () => {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => store.clear()),
    key: vi.fn(),
    get length() {
      return store.size;
    },
  } as unknown as Storage;
};

vi.mock('@/shared/lib/delay', () => ({
  delay: () => Promise.resolve(),
}));

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  Reflect.deleteProperty(globalThis as Record<string, unknown>, 'localStorage');
});

describe('login (mock mode)', () => {
  it('returns mock payload and persists remember flag', async () => {
    vi.doMock('@/shared/config/env', () => ({ ENV: { USE_MOCK: true } }));
    const storage = createLocalStorageMock();
    globalThis.localStorage = storage;

    const { login } = await import('./login.client');
    const result = await login({ email: 'test@vibot.com', password: 'secret' }, { remember: true });

    expect(storage.setItem).toHaveBeenCalledWith('remember', 'true');
    expect(result).toEqual({ ok: true, remember: true });
  });

  it('throws on mock failure', async () => {
    vi.doMock('@/shared/config/env', () => ({ ENV: { USE_MOCK: true } }));
    globalThis.localStorage = createLocalStorageMock();
    const { login } = await import('./login.client');

    await expect(login({ email: 'fail@vibot.com', password: 'fail' })).rejects.toThrow(
      'Invalid credentials',
    );
  });
});

describe('login (live mode)', () => {
  it('delegates to axios client with provided payload', async () => {
    const post = vi.fn().mockResolvedValue({ data: { token: 'abc' } });
    vi.doMock('@/shared/config/env', () => ({ ENV: { USE_MOCK: false } }));
    vi.doMock('@/shared/lib/axios', () => ({ default: { post } }));

    const { login } = await import('./login.client');
    const body = { email: 'admin@vibot.com', password: 'secret' };
    const response = await login(body, { remember: false });

    expect(post).toHaveBeenCalledWith('/auth/login', body, expect.any(Object));
    expect(response).toEqual({ token: 'abc' });
  });
});
