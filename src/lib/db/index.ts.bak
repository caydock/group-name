import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import * as schema from './schema';
import type { CloudflareEnv } from '@/types/cloudflare';

export function createProductionDB(env: CloudflareEnv) {
  return drizzleD1(env.DB, { schema });
}

let cachedDB: ReturnType<typeof createProductionDB> | null = null;

export function getDB(env?: CloudflareEnv) {
  if (cachedDB) {
    return cachedDB;
  }
  
  if (env) {
    cachedDB = createProductionDB(env);
    return cachedDB;
  }

  // Try to get env from Cloudflare context in Workers environment
  try {
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const cfEnv = getCloudflareContext();
    if (cfEnv?.env) {
      cachedDB = createProductionDB(cfEnv.env);
      return cachedDB;
    }
  } catch {
    // Not in Cloudflare Workers environment or getCloudflareContext not available
  }

  throw new Error('Cloudflare Workers environment (env) is required');
}

export type DB = any;