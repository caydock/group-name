import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/db/schema';
import { isNull, isNotNull, or, and } from 'drizzle-orm';

async function viewData() {
  const sqlite = new Database('./data/local.db');
  sqlite.pragma('foreign_keys = ON');
  const db = drizzle(sqlite, { schema });
  
  console.log('\n=== 分类列表 ===');
  const categories = await db.select().from(schema.categories);
  categories.forEach(c => console.log(`  ${c.id}: ${c.name} (${c.description})`));
  
  console.log('\n=== 合集列表 ===');
  const collections = await db.select().from(schema.collections);
  collections.forEach(c => console.log(`  ${c.id}: ${c.name} (${c.description})`));
  
  console.log('\n=== 已分类的群名示例 ===');
  const categorizedNames = await db.select().from(schema.groupNames).where(
    or(isNotNull(schema.groupNames.categoryId), isNotNull(schema.groupNames.collectionId))
  ).limit(20);
  
  categorizedNames.forEach(name => {
    const categoryInfo = name.categoryId ? `[分类: ${name.categoryId}]` : '';
    const collectionInfo = name.collectionId ? `[合集: ${name.collectionId}]` : '';
    console.log(`  ${name.name} ${categoryInfo}${collectionInfo}`);
  });
  
  console.log('\n=== 未分类的群名示例 ===');
  const uncategorizedNames = await db.select().from(schema.groupNames).where(
    and(isNull(schema.groupNames.categoryId), isNull(schema.groupNames.collectionId))
  ).limit(10);
  
  uncategorizedNames.forEach(name => console.log(`  ${name.name}`));
}

viewData();
