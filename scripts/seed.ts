import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import * as schema from '../src/lib/db/schema';
import { nanoid } from 'nanoid';

const sqlite = new Database('./data/local.db');
sqlite.pragma('foreign_keys = ON');
const db = drizzle(sqlite, { schema });

const categoriesData = [
	{ name: '搞笑', icon: '😂', sortOrder: 1 },
	{ name: '文艺', icon: '🎨', sortOrder: 2 },
	{ name: '商务', icon: '💼', sortOrder: 3 },
	{ name: '家庭', icon: '👨‍👩‍👧‍👦', sortOrder: 4 },
	{ name: '校园', icon: '🏫', sortOrder: 5 },
	{ name: '游戏', icon: '🎮', sortOrder: 6 },
];

const groupNamesData = [
	{ name: '不瘦十斤不改名', categoryName: '搞笑' },
	{ name: '幼儿园大班', categoryName: '搞笑' },
	{ name: '一群戏精', categoryName: '搞笑' },
	{ name: '佛系养生群', categoryName: '文艺' },
	{ name: '岁月静好', categoryName: '文艺' },
	{ name: '诗酒趁年华', categoryName: '文艺' },
	{ name: '项目讨论组', categoryName: '商务' },
	{ name: '创业伙伴', categoryName: '商务' },
	{ name: '一家人', categoryName: '家庭' },
	{ name: '相亲相爱', categoryName: '家庭' },
	{ name: '高三冲刺班', categoryName: '校园' },
	{ name: '校友会', categoryName: '校园' },
	{ name: '开黑大队', categoryName: '游戏' },
	{ name: '王者荣耀交流群', categoryName: '游戏' },
	{ name: '干饭小分队', categoryName: '搞笑' },
	{ name: '摸鱼专用群', categoryName: '搞笑' },
	{ name: '躺平青年', categoryName: '搞笑' },
	{ name: '奋斗青年', categoryName: '文艺' },
	{ name: '追梦人', categoryName: '文艺' },
	{ name: '商务合作', categoryName: '商务' },
	{ name: '战略合作伙伴', categoryName: '商务' },
	{ name: '温馨港湾', categoryName: '家庭' },
	{ name: '爱的港湾', categoryName: '家庭' },
	{ name: '大学同学', categoryName: '校园' },
	{ name: '高中同学会', categoryName: '校园' },
	{ name: '吃鸡小队', categoryName: '游戏' },
	{ name: 'LOL开黑群', categoryName: '游戏' },
];

const collectionsData = [
	{ name: '最受欢迎群名', description: '最受欢迎的微信群名合集', isFeatured: true, sortOrder: 1 },
	{ name: '搞笑群名大全', description: '让人捧腹大笑的群名', isFeatured: true, sortOrder: 2 },
	{ name: '文艺清新群名', description: '富有诗意的群名', isFeatured: true, sortOrder: 3 },
];

async function seed() {
	console.log('开始插入用户数据...');
	const userId = nanoid();
	await db.insert(schema.users).values({
		id: userId,
		ipAddress: '127.0.0.1',
	});
	console.log('用户数据插入完成');

	console.log('开始插入分类数据...');
	const categoryMap = new Map<string, number>();
	for (const category of categoriesData) {
		const result = await db.insert(schema.categories).values(category).returning({ id: schema.categories.id });
		categoryMap.set(category.name, result[0].id);
	}
	console.log('分类数据插入完成');

	console.log('开始插入群名数据...');
	console.log('分类映射:', Object.fromEntries(categoryMap));
	for (const groupName of groupNamesData) {
		const categoryId = categoryMap.get(groupName.categoryName);
		if (!categoryId) {
			console.error(`分类不存在: ${groupName.categoryName}`);
			continue;
		}
		
		console.log(`插入群名: ${groupName.name}, 分类ID: ${categoryId}`);
		await db.insert(schema.groupNames).values({
			name: groupName.name,
			categoryId,
			userId,
			status: 'approved',
			views: Math.floor(Math.random() * 1000),
			likes: Math.floor(Math.random() * 100),
			copies: Math.floor(Math.random() * 50),
		});
	}
	console.log('群名数据插入完成');

	console.log('开始插入合集数据...');
	for (const collection of collectionsData) {
		const result = await db.insert(schema.collections).values({
			name: collection.name,
			description: collection.description,
			isFeatured: collection.isFeatured,
			sortOrder: collection.sortOrder,
		}).returning({ id: schema.collections.id });

		const collectionId = result[0].id;
		
		const matchingCategory = categoriesData.find(c => collection.name.includes(c.name));
		if (matchingCategory) {
			const categoryId = categoryMap.get(matchingCategory.name);
			if (categoryId) {
				const allNames = await db.select().from(schema.groupNames)
					.where(eq(schema.groupNames.categoryId, categoryId));
				
				for (const groupName of allNames.slice(0, 10)) {
					await db.update(schema.groupNames)
						.set({ collectionId })
						.where(eq(schema.groupNames.id, groupName.id));
				}
			}
		}
	}
	console.log('合集数据插入完成');

	console.log('数据种子插入完成！');
	process.exit(0);
}

seed().catch((error) => {
	console.error('Error seeding database:', error);
	process.exit(1);
});