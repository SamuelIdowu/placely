// src/lib/rate-limit.ts

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

export interface RateLimitConfig {
  intervalMs?: number;
  maxRequests?: number;
}

export function rateLimit(
  key: string,
  config: RateLimitConfig = { intervalMs: 60 * 1000, maxRequests: 20 }
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const interval = config.intervalMs ?? 60 * 1000;
  const max = config.maxRequests ?? 20;

  const current = store.get(key);

  if (!current || now > current.resetTime) {
    const resetTime = now + interval;
    store.set(key, { count: 1, resetTime });
    return { success: true, limit: max, remaining: max - 1, reset: resetTime };
  }

  if (current.count >= max) {
    return {
      success: false,
      limit: max,
      remaining: 0,
      reset: current.resetTime,
    };
  }

  current.count += 1;
  store.set(key, current);

  return {
    success: true,
    limit: max,
    remaining: max - current.count,
    reset: current.resetTime,
  };
}
