import { createLocalDB } from '../src/lib/db';
import * as schema from '../src/lib/db/schema';
import { eq, isNotNull } from 'drizzle-orm';

async function checkCollections() {
  const db = createLocalDB();
  
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
