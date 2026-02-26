import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { getDB as getProductionDB } from './index';
import type { CloudflareEnv } from '@/types/cloudflare';

// 本地数据库连接
let localDB: ReturnType<typeof drizzle> | null = null;

function getLocalDB() {
  if (localDB) {
    return localDB;
  }
  
  // 使用环境变量中的数据库路径，如果没有则使用默认路径
  const dbPath = process.env.DATABASE_URL || './data/local.db';
  const sqlite = new Database(dbPath);
  localDB = drizzle(sqlite, { schema });
  
  return localDB;
}

// 统一的数据库获取函数
export function getDB(env?: CloudflareEnv) {
  // 在开发环境中使用本地 SQLite 数据库
  if (process.env.NODE_ENV === 'development') {
    return getLocalDB();
  }
  
  // 在生产环境中使用 Cloudflare D1 数据库
  return getProductionDB(env);
}

export type DB = ReturnType<typeof getDB>;