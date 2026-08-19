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

class SafeRedisClient {
  private client: Redis | null = null;
  private fallback = new MemoryCache();
  private isConnected = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl && !redisUrl.includes("your-redis") && redisUrl.startsWith("redis")) {
      try {
        this.client = new Redis(redisUrl, {
          maxRetriesPerRequest: 1,
          connectTimeout: 3000,
          commandTimeout: 3000,
          enableReadyCheck: false,
          lazyConnect: true,
          retryStrategy(times) {
            if (times > 2) return null;
            return Math.min(times * 100, 1000);
          },
        });

        this.client.connect().then(() => {
          this.isConnected = true;
        }).catch(() => {
          this.isConnected = false;
        });

        this.client.on("connect", () => {
          this.isConnected = true;
        });

        this.client.on("error", () => {
          this.isConnected = false;
        });
      } catch {
        this.client = null;
      }
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.client && this.isConnected) {
      try {
        return await this.client.get(key);
      } catch {
        return await this.fallback.get(key);
      }
    }
    return await this.fallback.get(key);
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<string> {
    if (this.client && this.isConnected) {
      try {
        if (mode === "EX" && typeof duration === "number") {
          return await this.client.set(key, value, "EX", duration);
        }
        return await this.client.set(key, value);
      } catch {
        return await this.fallback.set(key, value, mode, duration);
      }
    }
    return await this.fallback.set(key, value, mode, duration);
  }

  async del(key: string): Promise<number> {
    if (this.client && this.isConnected) {
      try {
        return await this.client.del(key);
      } catch {
        return await this.fallback.del(key);
      }
    }
    return await this.fallback.del(key);
  }

  async incr(key: string): Promise<number> {
    if (this.client && this.isConnected) {
      try {
        return await this.client.incr(key);
      } catch {
        return await this.fallback.incr(key);
      }
    }
    return await this.fallback.incr(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (this.client && this.isConnected) {
      try {
        return await this.client.expire(key, seconds);
      } catch {
        return await this.fallback.expire(key, seconds);
      }
    }
    return await this.fallback.expire(key, seconds);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var redisGlobal: SafeRedisClient | undefined;
}

export const redis = globalThis.redisGlobal ?? new SafeRedisClient();
globalThis.redisGlobal = redis;

export default redis;
