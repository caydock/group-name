import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import Database from 'better-sqlite3';
import * as schema from './schema';
import type { CloudflareEnv } from '@/types/cloudflare';

export function createLocalDB() {
  const dbPath = process.env.DB || './data/local.db';
  const sqlite = new Database(dbPath);
  
  sqlite.pragma('foreign_keys = ON');
  
  return drizzle(sqlite, { schema });
}

export function createProductionDB(env: CloudflareEnv) {
  return drizzleD1(env.DB, { schema });
}

export function getDB(env?: CloudflareEnv) {
  if (process.env.NODE_ENV === 'production' && env) {
    return createProductionDB(env);
  }
  return createLocalDB();
}

export type DB = any;