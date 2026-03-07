import { Redis } from "@upstash/redis";

const DAILY_GLOBAL_LIMIT = Number(process.env.DAILY_GLOBAL_LIMIT) || 100;
const KEY_PREFIX = "diagnosis";

const getRedis = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
};

const getTodayKey = () => {
  const today = new Date().toISOString().slice(0, 10);
  return `${KEY_PREFIX}:${today}`;
};

/** グローバル日次制限チェック＆インクリメント */
export const checkGlobalRateLimit = async (): Promise<boolean> => {
  const redis = getRedis();
  if (!redis) {
    // Redis未設定時は安全側に倒す（本番では必ず Redis を設定すること）
    return false;
  }

  const key = getTodayKey();
  const count = await redis.incr(key);

  // 初回のみTTLを設定（25時間で自動削除）
  if (count === 1) {
    await redis.expire(key, 90000);
  }

  return count <= DAILY_GLOBAL_LIMIT;
};

/** 現在の使用数を取得（管理用） */
export const getCurrentUsage = async (): Promise<number> => {
  const redis = getRedis();
  if (!redis) return -1;
  const count = await redis.get<number>(getTodayKey());
  return count ?? 0;
};
