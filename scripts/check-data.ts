import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/db/schema';
import { or, isNotNull } from 'drizzle-orm';

async function checkData() {
  const sqlite = new Database('./data/local.db');
  sqlite.pragma('foreign_keys = ON');
  const db = drizzle(sqlite, { schema });
  const categories = await db.select().from(schema.categories);
  const collections = await db.select().from(schema.collections);
  const groupNames = await db.select().from(schema.groupNames);

  console.log('分类:', categories.length);
  console.log('合集:', collections.length);
  console.log('群名:', groupNames.length);
  
  const categorizedNames = await db.select().from(schema.groupNames).where(
    or(isNotNull(schema.groupNames.categoryId), isNotNull(schema.groupNames.collectionId))
  );
  console.log('已分类群名:', categorizedNames.length);
}

checkData();
