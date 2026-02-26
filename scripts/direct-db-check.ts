import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../src/lib/db/schema';

// 直接连接到本地数据库
const dbPath = './data/local.db';
const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

async function checkData() {
  try {
    const categories = await db.select().from(schema.categories);
    const collections = await db.select().from(schema.collections);
    const groupNames = await db.select().from(schema.groupNames).limit(10);
    
    console.log('分类数量:', categories.length);
    console.log('合集数量:', collections.length);
    console.log('群名数量:', groupNames.length);
    
    console.log('\n分类列表:');
    categories.forEach(cat => console.log(`- ${cat.name} (ID: ${cat.id})`));
    
    console.log('\n合集列表:');
    collections.forEach(col => console.log(`- ${col.name} (ID: ${col.id})`));
    
    console.log('\n前10个群名:');
    groupNames.forEach(name => {
      console.log(`- ${name.name} (分类ID: ${name.categoryId}, 合集ID: ${name.collectionId})`);
    });
    
  } catch (error) {
    console.error('检查数据时出错:', error);
  } finally {
    sqlite.close();
  }
}

checkData();