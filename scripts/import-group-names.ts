import fs from 'fs';
import csv from 'csv-parser';
import { createLocalDB } from '../src/lib/db';
import * as schema from '../src/lib/db/schema';

interface CSVRow {
  click: string;
  createdAt: string;
  name: string;
  objectId: string;
  status: string;
  updatedAt: string;
  userObjectId: string;
  dependent: string;
  author: string;
}

const db = createLocalDB();

function categorizeGroupName(name: string): { categoryId?: number; collectionId?: number } {
  const lowerName = name.toLowerCase();
  
  const categoryMap: Record<string, string[]> = {
    '搞笑': ['逗比', '二货', '搞笑', '智障', '蛇精病', '逗逼', '疯人院', '沙雕', '哈哈', '笑死', '哈哈哈'],
    '恶搞': ['恶搞', '作死', '搞事', '作妖', '作怪', '捣乱', '搞破坏', '祸害'],
    '污妖': ['奶', '胸', '摸胸', '骚', '污', '色', '腿', '屁股', '骚逼', '奶子', '大胸', '巨胸', '小胸', '胸平', '搓胸'],
    '抽象': ['抽象', 'Tree New Bee', '404', 'skr', 'free style', 'battle', '三体', 'O3O', '或不或', '或7', '或或或'],
    '文艺': ['理想国', '流年', '经年', '红尘', '木槿', '深院', '日月星', '粲然', '青春', '回忆', '那些年', '失去的', '解忧杂货铺', '孟婆汤', '仙凡奇情', '乱世佳人', '时代姐妹花'],
    '可爱': ['萌', '可爱', '小仙女', '小天使', '小宝贝', '小可爱', '小甜心', '少女', '仙女', '仙女湖', '贝贝公主', '喵了个咪', '喵', '小卖部', '小分队', '少女天团', '青春无敌美少女', '萌妞优酸乳', '幼儿园', '甜了个密']
  };

  const collectionMap: Record<string, string[]> = {
    '三人群名大全': ['三人行', '我和两个', '两个他', '三个', '三人', '三傻', '三兄弟', '三姐妹'],
    '四人群名大全': ['四小鬼', '四贱', '四人', '四兄弟', '四姐妹', '魑魅魍魉'],
    '五人群名大全': ['五壮士', '五霸', '五宝', '五人', '五兄弟', '五姐妹'],
    '六人群名大全': ['六国', '六人', '六兄弟', '六姐妹', '六侠'],
    '家庭群名大全': ['相亲相爱', '家庭', '一家', '一家人', '伐木累', '避风港', '皇亲国戚', '东北一家银', '家穷', '老丈人', '爸爸', '妈妈', '儿女', '慈宁宫', '养心殿', '漱芳斋', '后宫'],
    '寝室群名': ['室友', '舍友', '寝室', '宿舍', '寝室', '同福客栈', '塑料姐妹花', '靠脸吃饭', '少女战士', '美少女'],
    '爱豆群名大全': ['后援会', '粉丝', '偶像', '鹿晗', '杨洋', 'TF', '爱豆', '女团', '男团', '天团']
  };

  for (const [category, keywords] of Object.entries(categoryMap)) {
    for (const keyword of keywords) {
      if (lowerName.includes(keyword.toLowerCase())) {
        return { categoryId: categoryToId[category] };
      }
    }
  }

  for (const [collection, keywords] of Object.entries(collectionMap)) {
    for (const keyword of keywords) {
      if (lowerName.includes(keyword.toLowerCase())) {
        return { collectionId: collectionToId[collection] };
      }
    }
  }

  return {};
}

const categoryToId: Record<string, number> = {};
const collectionToId: Record<string, number> = {};

async function main() {
  console.log('开始导入群名数据...');

  console.log('\n1. 清空数据库...');
  await db.delete(schema.groupNames);
  await db.delete(schema.categories);
  await db.delete(schema.collections);
  console.log('   数据库已清空');

  console.log('\n2. 创建分类...');
  const categories = [
    { name: '搞笑', description: '搞笑类群名', sortOrder: 1 },
    { name: '恶搞', description: '恶搞类群名', sortOrder: 2 },
    { name: '污妖', description: '污妖类群名', sortOrder: 3 },
    { name: '抽象', description: '抽象类群名', sortOrder: 4 },
    { name: '文艺', description: '文艺类群名', sortOrder: 5 },
    { name: '可爱', description: '可爱类群名', sortOrder: 6 }
  ];

  for (const category of categories) {
    const [result] = await db.insert(schema.categories).values(category).returning();
    categoryToId[category.name] = result.id;
    console.log(`   ✓ 创建分类: ${category.name} (ID: ${result.id})`);
  }

  console.log('\n3. 创建合集...');
  const collections = [
    { name: '三人群名大全', description: '适合三人的群名', sortOrder: 1 },
    { name: '四人群名大全', description: '适合四人的群名', sortOrder: 2 },
    { name: '五人群名大全', description: '适合五人的群名', sortOrder: 3 },
    { name: '六人群名大全', description: '适合六人的群名', sortOrder: 4 },
    { name: '家庭群名大全', description: '家庭群名', sortOrder: 5 },
    { name: '寝室群名', description: '寝室群名', sortOrder: 6 },
    { name: '爱豆群名大全', description: '爱豆粉丝群名', sortOrder: 7 }
  ];

  for (const collection of collections) {
    const [result] = await db.insert(schema.collections).values(collection).returning();
    collectionToId[collection.name] = result.id;
    console.log(`   ✓ 创建合集: ${collection.name} (ID: ${result.id})`);
  }

  console.log('\n4. 读取CSV文件并导入群名...');
  const csvPath = process.env.HOME + '/Desktop/Names_20240106_161520.csv';
  const rows: CSVRow[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row: CSVRow) => {
        rows.push(row);
      })
      .on('end', () => {
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });

  console.log(`   读取到 ${rows.length} 条数据`);

  console.log('\n5. 导入群名到数据库...');
  let importedCount = 0;
  let categorizedCount = 0;
  let uncategorizedCount = 0;

  for (const row of rows) {
    if (!row.name || row.name.trim() === '') continue;

    const categorization = categorizeGroupName(row.name);
    
    await db.insert(schema.groupNames).values({
      name: row.name.trim(),
      categoryId: categorization.categoryId,
      collectionId: categorization.collectionId,
      views: parseInt(row.click) || 0,
      likes: 0,
      copies: 0,
      status: 'approved',
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    });

    importedCount++;
    if (categorization.categoryId || categorization.collectionId) {
      categorizedCount++;
    } else {
      uncategorizedCount++;
    }
  }

  console.log('\n========================================');
  console.log('导入完成！');
  console.log('========================================');
  console.log(`总导入: ${importedCount} 条群名`);
  console.log(`已分类: ${categorizedCount} 条`);
  console.log(`未分类: ${uncategorizedCount} 条`);
  console.log(`分类数: ${categories.length}`);
  console.log(`合集数: ${collections.length}`);
  console.log('========================================');
}

main().catch(console.error);
