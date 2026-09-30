const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

interface RateLimit {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimit>();

export function checkRateLimit(ip: string | null): boolean {
  if (!ip) return true;

  const now = Date.now();
  const record = store.get(ip);

  if (!record || now >= record.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (record.count >= LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of store.entries()) {
    if (now >= record.resetAt) {
      store.delete(ip);
    }
  }
}, 5 * 60 * 1000);
