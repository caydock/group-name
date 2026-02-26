import Database from 'better-sqlite3';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import type { CloudflareEnv } from '@/types/cloudflare';

export function createProductionDB(env: CloudflareEnv) {
  return drizzleD1(env.DB, { schema });
}

let cachedProductionDB: ReturnType<typeof createProductionDB> | null = null;
let cachedLocalDB: ReturnType<typeof drizzleSQLite> | null = null;

function getLocalDB() {
  if (cachedLocalDB) {
    return cachedLocalDB;
  }
  
  // 使用环境变量中的数据库路径，如果没有则使用默认路径
  const dbPath = process.env.DATABASE_URL || './data/local.db';
  const sqlite = new Database(dbPath);
  cachedLocalDB = drizzleSQLite(sqlite, { schema });
  
  return cachedLocalDB;
}

export function getDB(env?: CloudflareEnv) {
  // 在开发环境中使用本地 SQLite 数据库
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    return getLocalDB();
  }
  
  // 在生产环境中使用 Cloudflare D1 数据库
  if (cachedProductionDB) {
    return cachedProductionDB;
  }
  
  if (env) {
    cachedProductionDB = createProductionDB(env);
    return cachedProductionDB;
  }

  // Try to get env from Cloudflare context in Workers environment
  try {
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const cfEnv = getCloudflareContext();
    if (cfEnv?.env) {
      cachedProductionDB = createProductionDB(cfEnv.env);
      return cachedProductionDB;
    }
  } catch {
    // Not in Cloudflare Workers environment or getCloudflareContext not available
    // Fall back to local database
    return getLocalDB();
  }

  throw new Error('Cloudflare Workers environment (env) is required');
}

export type DB = any;