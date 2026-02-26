import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../src/lib/db/schema';
import fs from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';

// 清空数据库表
async function clearDatabase(db: any) {
  console.log('清空数据库...');
  
  // 按依赖关系顺序删除数据
  await db.delete(schema.groupNames);
  await db.delete(schema.collections);
  await db.delete(schema.categories);
  
  console.log('数据库已清空');
}

// 创建分类
async function createCategories(db: any) {
  console.log('创建分类...');
  
  const categories = [
    { name: '搞笑', description: '幽默搞笑的群名' },
    { name: '恶搞', description: '恶搞整蛊的群名' },
    { name: '污妖', description: '有点污的群名' },
    { name: '抽象', description: '抽象难懂的群名' },
    { name: '文艺', description: '文艺范儿的群名' },
    { name: '可爱', description: '可爱风格的群名' },
  ];
  
  const insertedCategories = [];
  for (const category of categories) {
    const [result] = await db.insert(schema.categories).values(category).returning();
    insertedCategories.push(result);
    console.log(`已创建分类: ${category.name}`);
  }
  
  return insertedCategories;
}

// 创建合集
async function createCollections(db: any) {
  console.log('创建合集...');
  
  const collections = [
    { name: '三人群名大全', description: '适合三人使用的群名', isFeatured: false },
    { name: '四人群名大全', description: '适合四人使用的群名', isFeatured: false },
    { name: '五人群名大全', description: '适合五人使用的群名', isFeatured: false },
    { name: '六人群名大全', description: '适合六人使用的群名', isFeatured: false },
    { name: '家庭群名大全', description: '适合家庭成员使用的群名', isFeatured: false },
    { name: '寝室群名', description: '适合室友使用的群名', isFeatured: false },
    { name: '爱豆群名大全', description: '粉丝团群名', isFeatured: false },
  ];
  
  const insertedCollections = [];
  for (const collection of collections) {
    const [result] = await db.insert(schema.collections).values(collection).returning();
    insertedCollections.push(result);
    console.log(`已创建合集: ${collection.name}`);
  }
  
  return insertedCollections;
}

// 分析群名并分配到合适的分类或合集
function categorizeGroupName(name: string, categoriesMap: any, collectionsMap: any) {
  const lowerName = name.toLowerCase();
  
  // 爱豆群名 - 包含明星、粉丝、后援会等关键词
  if (lowerName.includes('粉丝') || lowerName.includes('后援会') || 
      lowerName.includes('老婆') && (lowerName.includes('杨洋') || lowerName.includes('鹿晗')) ||
      lowerName.includes('偶像') || lowerName.includes('爱豆') ||
      lowerName.includes('tfboys') || lowerName.includes('tf') ||
      lowerName.includes('少女') && (lowerName.includes('时代') || lowerName.includes('snh48'))) {
    return { type: 'collection', id: collectionsMap.get('爱豆群名大全') };
  }
  
  // 家庭群名 - 包含家庭、父子、母子、兄弟、姐妹等关键词
  if (lowerName.includes('家庭') || lowerName.includes('父子') || lowerName.includes('母子') ||
      lowerName.includes('兄弟') || lowerName.includes('姐妹') || lowerName.includes('爸爸') ||
      lowerName.includes('妈妈') || lowerName.includes('爷爷') || lowerName.includes('奶奶') ||
      lowerName.includes('一家') || lowerName.includes('相亲相爱') || lowerName.includes('亲情')) {
    return { type: 'collection', id: collectionsMap.get('家庭群名大全') };
  }
  
  // 寝室群名 - 包含室友、寝室、宿舍等关键词
  if (lowerName.includes('寝室') || lowerName.includes('宿舍') || lowerName.includes('室友') ||
      lowerName.includes('舍友') || lowerName.includes('203') || lowerName.includes('302') ||
      lowerName.includes('404') || lowerName.includes('xxx寝室')) {
    return { type: 'collection', id: collectionsMap.get('寝室群名') };
  }
  
  // 三人、四人、五人、六人群名 - 直接根据数字判断
  if (lowerName.includes('三人') || lowerName.includes('3') && !lowerName.includes('300')) {
    return { type: 'collection', id: collectionsMap.get('三人群名大全') };
  }
  if (lowerName.includes('四人') || lowerName.includes('4') && !lowerName.includes('400')) {
    return { type: 'collection', id: collectionsMap.get('四人群名大全') };
  }
  if (lowerName.includes('五人') || lowerName.includes('5') && !lowerName.includes('500')) {
    return { type: 'collection', id: collectionsMap.get('五人群名大全') };
  }
  if (lowerName.includes('六人') || lowerName.includes('6') && !lowerName.includes('600')) {
    return { type: 'collection', id: collectionsMap.get('六人群名大全') };
  }
  
  // 污妖分类 - 包含污、性暗示等关键词
  if (lowerName.includes('污') || lowerName.includes('摸胸') || lowerName.includes('奶') ||
      lowerName.includes('胸') || lowerName.includes('臀') || lowerName.includes('骚') ||
      lowerName.includes('约炮') || lowerName.includes('sex') || lowerName.includes('做爱') ||
      lowerName.includes('阴茎') || lowerName.includes('阴部') || lowerName.includes('屄') ||
      lowerName.includes('逼') || lowerName.includes('操') || lowerName.includes('肏') ||
      lowerName.includes('干') && !lowerName.includes('干净') || lowerName.includes('日')) {
    return { type: 'category', id: categoriesMap.get('污妖') };
  }
  
  // 抽象分类 - 难以理解的、怪异的、无厘头的
  if (lowerName.includes('抽象') || lowerName.includes('难懂') || lowerName.includes('无厘头') ||
      lowerName.includes('怪') || lowerName.includes('奇') || lowerName.includes('异') ||
      lowerName.includes('魑魅魍魉') || lowerName.includes('饕餮') || lowerName.includes('蟾蜍') ||
      lowerName.includes('乱码') || lowerName.includes('符号') && lowerName.length < 10 ||
      (lowerName.match(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g) && lowerName.match(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g)!.length > 3)) {
    return { type: 'category', id: categoriesMap.get('抽象') };
  }
  
  // 可爱分类 - 包含萌、可爱、小、宝宝等关键词
  if (lowerName.includes('萌') || lowerName.includes('可爱') || lowerName.includes('小') ||
      lowerName.includes('宝宝') || lowerName.includes('宝贝') || lowerName.includes('贝贝') ||
      lowerName.includes('喵') || lowerName.includes('汪') || lowerName.includes('兔') ||
      lowerName.includes('熊') || lowerName.includes('猪') || lowerName.includes('奶糖') ||
      lowerName.includes('甜甜') || lowerName.includes('糖') || lowerName.includes('棉花糖') ||
      lowerName.includes('少女') && !lowerName.includes('时代')) {
    return { type: 'category', id: categoriesMap.get('可爱') };
  }
  
  // 文艺分类 - 包含诗意、文学、艺术等关键词
  if (lowerName.includes('文艺') || lowerName.includes('诗') || lowerName.includes('花') ||
      lowerName.includes('云') || lowerName.includes('雨') || lowerName.includes('风') ||
      lowerName.includes('月') || lowerName.includes('星') || lowerName.includes('夜') ||
      lowerName.includes('梦') || lowerName.includes('情') || lowerName.includes('心') ||
      lowerName.includes('时光') || lowerName.includes('青春') || lowerName.includes('回忆') ||
      lowerName.includes('岁月') || lowerName.includes('流年') || lowerName.includes('人生') ||
      lowerName.includes('红尘') || lowerName.includes('繁华') || lowerName.includes('似锦') ||
      lowerName.includes('木槿') || lowerName.includes('昔年') || lowerName.includes('粲然')) {
    return { type: 'category', id: categoriesMap.get('文艺') };
  }
  
  // 恶搞分类 - 包含整蛊、恶搞、嘲讽等关键词
  if (lowerName.includes('恶搞') || lowerName.includes('整蛊') || lowerName.includes('嘲讽') ||
      lowerName.includes('黑') || lowerName.includes('喷') || lowerName.includes('怼') ||
      lowerName.includes('怼') || lowerName.includes('怼人') || lowerName.includes('吐槽') ||
      lowerName.includes('骂') || lowerName.includes('怼') || lowerName.includes('黑')) {
    return { type: 'category', id: categoriesMap.get('恶搞') };
  }
  
  // 搞笑分类 - 包含笑、逗、欢乐等关键词
  if (lowerName.includes('笑') || lowerName.includes('逗') || lowerName.includes('欢乐') ||
      lowerName.includes('哈哈') || lowerName.includes('嘿嘿') || lowerName.includes('嘻嘻') ||
      lowerName.includes('哈哈哈') || lowerName.includes('嘿嘿嘿') || lowerName.includes('嘻嘻嘻') ||
      lowerName.includes('乐') || lowerName.includes('开心') || lowerName.includes('快乐') ||
      lowerName.includes('高兴') || lowerName.includes('欢乐') || lowerName.includes('喜悦') ||
      lowerName.includes('欢乐') || lowerName.includes('哈哈哈') || lowerName.includes('乐呵呵') ||
      lowerName.includes('哈哈哈') || lowerName.includes('嘻嘻') || lowerName.includes('嘿嘿') ||
      lowerName.includes('欢乐') || lowerName.includes('开心') || lowerName.includes('快乐') ||
      lowerName.includes('哈哈') || lowerName.includes('嘿嘿') || lowerName.includes('嘻嘻') ||
      lowerName.includes('乐') || lowerName.includes('开心') || lowerName.includes('快乐') ||
      lowerName.includes('高兴') || lowerName.includes('欢乐') || lowerName.includes('喜悦') ||
      lowerName.includes('欢乐') || lowerName.includes('哈哈哈') || lowerName.includes('乐呵呵')) {
    return { type: 'category', id: categoriesMap.get('搞笑') };
  }
  
  // 默认分配到搞笑分类
  return { type: 'category', id: categoriesMap.get('搞笑') };
}

// 导入群名数据
async function importGroupNames(db: any, categories: any, collections: any) {
  console.log('导入群名数据...');
  
  // 创建分类和合集的映射表
  const categoriesMap = new Map();
  categories.forEach((cat: any) => {
    categoriesMap.set(cat.name, cat.id);
  });
  
  const collectionsMap = new Map();
  collections.forEach((col: any) => {
    collectionsMap.set(col.name, col.id);
  });
  
  // 读取CSV文件
  const csvPath = '/Users/Bright/Desktop/Names_20240106_161520.csv';
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  
  // 解析CSV
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  
  let importedCount = 0;
  let categorizedCount = 0;
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',');
    if (values.length < headers.length) continue;
    
    const nameIndex = headers.indexOf('name');
    const name = values[nameIndex]?.replace(/"/g, '').trim();
    
    if (!name) continue;
    
    // 分析群名并分配到合适的分类或合集
    const assignment = categorizeGroupName(name, categoriesMap, collectionsMap);
    
    // 插入群名数据
    await db.insert(schema.groupNames).values({
      name: name,
      categoryId: assignment.type === 'category' ? assignment.id : null,
      collectionId: assignment.type === 'collection' ? assignment.id : null,
      status: 'approved', // 直接设为已审核
      views: Math.floor(Math.random() * 1000), // 随机浏览量
      likes: Math.floor(Math.random() * 100), // 随机点赞数
      copies: Math.floor(Math.random() * 50), // 随机复制数
    });
    
    importedCount++;
    if (assignment.type !== 'category' || assignment.id !== categoriesMap.get('搞笑')) {
      categorizedCount++;
    }
    
    if (importedCount % 100 === 0) {
      console.log(`已导入 ${importedCount} 条群名数据`);
    }
  }
  
  console.log(`群名导入完成！共导入 ${importedCount} 条群名，其中 ${categorizedCount} 条已分类`);
}

async function main() {
  const dbPath = './data/local.db';
  const dir = path.dirname(dbPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const sqlite = new Database(dbPath);
  const db = drizzle(sqlite, { schema });

  try {
    // 清空数据库
    await clearDatabase(db);
    
    // 创建分类
    const categories = await createCategories(db);
    
    // 创建合集
    const collections = await createCollections(db);
    
    // 导入群名数据
    await importGroupNames(db, categories, collections);
    
    console.log('数据导入完成！');
  } catch (error) {
    console.error('执行过程中出错:', error);
  } finally {
    sqlite.close();
  }
}

main().catch((error) => {
  console.error('脚本执行失败:', error);
  process.exit(1);
});