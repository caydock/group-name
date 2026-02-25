import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function updateFeaturedCollections() {
  const sqlite = new Database('./data/local.db');
  sqlite.pragma('foreign_keys = ON');
  const db = drizzle(sqlite, { schema });
  
  console.log('更新精选合集状态...\n');
  
  // 将所有合集都设置为精选
  const collections = await db.select().from(schema.collections);
  
  for (const collection of collections) {
    await db.update(schema.collections)
      .set({ isFeatured: true, updatedAt: new Date() })
      .where(eq(schema.collections.id, collection.id));
    console.log(`✓ ${collection.name} 已设置为精选`);
  }
  
  console.log('\n完成！所有合集已设置为精选状态。');
}

updateFeaturedCollections().catch(console.error);
