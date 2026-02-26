import { getDB } from '../src/lib/db';
import * as schema from '../src/lib/db/schema';

async function checkData() {
  try {
    const db = getDB();
    const categories = await db.select().from(schema.categories);
    const collections = await db.select().from(schema.collections);
    const groupNames = await db.select().from(schema.groupNames);
    
    console.log('分类数量:', categories.length);
    console.log('合集数量:', collections.length);
    console.log('群名数量:', groupNames.length);
    
    console.log('\n分类列表:');
    categories.forEach(cat => console.log(`- ${cat.name} (ID: ${cat.id})`));
    
    console.log('\n合集列表:');
    collections.forEach(col => console.log(`- ${col.name} (ID: ${col.id})`));
    
    console.log('\n前5个群名:');
    groupNames.slice(0, 5).forEach(name => console.log(`- ${name.name}`));
    
    // 检查分类和合集的群名数量
    const categorizedGroupNames = groupNames.filter(gn => gn.categoryId);
    const collectionGroupNames = groupNames.filter(gn => gn.collectionId);
    
    console.log('\n已分类群名数量:', categorizedGroupNames.length);
    console.log('已分配合集群名数量:', collectionGroupNames.length);
  } catch (error) {
    console.error('检查数据时出错:', error);
  }
}

checkData().catch(console.error);