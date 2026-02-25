import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function checkCollections() {
  const sqlite = new Database('./data/local.db');
  sqlite.pragma('foreign_keys = ON');
  const db = drizzle(sqlite, { schema });
  
  console.log('\n=== 检查合集数据 ===');
  const collections = await db.select().from(schema.collections);
  console.log(`合集总数: ${collections.length}\n`);
  
  for (const collection of collections) {
    const names = await db.select().from(schema.groupNames).where(
      eq(schema.groupNames.collectionId, collection.id)
    );
    console.log(`合集: ${collection.name} (ID: ${collection.id})`);
    console.log(`  描述: ${collection.description}`);
    console.log(`  群名数量: ${names.length}`);
    if (names.length > 0 && names.length <= 5) {
      console.log(`  示例: ${names.map(n => n.name).join(', ')}`);
    } else if (names.length > 5) {
      console.log(`  示例: ${names.slice(0, 5).map(n => n.name).join(', ')}...`);
    }
    console.log('');
  }
}

checkCollections();
