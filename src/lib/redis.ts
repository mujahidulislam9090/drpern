import Redis from "ioredis";

class MemoryCache {
  private store = new Map<string, { value: string; expiresAt: number | null }>();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<string> {
    let expiresAt: number | null = null;
    if (mode === "EX" && typeof duration === "number") {
      expiresAt = Date.now() + duration * 1000;
    }
    this.store.set(key, { value, expiresAt });
    return "OK";
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key);
    const num = (current ? parseInt(current, 10) : 0) + 1;
    await this.set(key, num.toString());
    return num;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const entry = this.store.get(key);
    if (!entry) return 0;
    entry.expiresAt = Date.now() + seconds * 1000;
    this.store.set(key, entry);
    return 1;
  }
}

declare global {
  // eslint-disable-next-line no-var
  var redisGlobal: Redis | MemoryCache | undefined;
}

function createRedisClient() {
  if (process.env.REDIS_URL) {
    try {
      const client = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 1,
        retryStrategy(times) {
          if (times > 3) return null;
          return Math.min(times * 50, 1000);
        },
      });
      client.on("error", (err) => {
        console.warn("Redis connection error, falling back to memory cache:", err.message);
      });
      return client;
    } catch {
      return new MemoryCache();
    }
  }
  return new MemoryCache();
}

export const redis = globalThis.redisGlobal ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.redisGlobal = redis;
}

export default redis;
