import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { eq, and, desc, like } from 'drizzle-orm';
import { groupNames, categories, collections } from '@/lib/db/schema';

// 获取群名列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const collectionId = searchParams.get('collectionId');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    const db = getDB();
    
    // 构建查询条件
    let conditions = [eq(groupNames.status, 'approved')];
    
    if (categoryId) {
      conditions.push(eq(groupNames.categoryId, parseInt(categoryId)));
    }
    
    if (collectionId) {
      conditions.push(eq(groupNames.collectionId, parseInt(collectionId)));
    }
    
    if (search) {
      conditions.push(like(groupNames.name, `%${search}%`));
    }
    
    // 获取群名列表
    const whereConditions = conditions.length > 1 ? and(...conditions) : conditions[0];
    const groupNamesList = await db
      .select()
      .from(groupNames)
      .where(whereConditions)
      .orderBy(desc(groupNames.createdAt))
      .limit(limit)
      .offset(offset);
    
    // 获取总数
    const totalResult = await db
      .select()
      .from(groupNames)
      .where(whereConditions);
    
    // 获取分类和合集信息
    const allCategories = await db.select().from(categories);
    const allCollections = await db.select().from(collections);
    
    // 添加分类和合集名称
    const groupNamesWithDetails = groupNamesList.map(name => {
      const category = allCategories.find(cat => cat.id === name.categoryId);
      const collection = allCollections.find(col => col.id === name.collectionId);
      
      return {
        ...name,
        category: category ? { id: category.id, name: category.name } : null,
        collection: collection ? { id: collection.id, name: collection.name } : null
      };
    });
    
    return NextResponse.json({
      groupNames: groupNamesWithDetails,
      total: totalResult.length,
      page,
      limit,
      totalPages: Math.ceil(totalResult.length / limit)
    });
  } catch (error) {
    console.error('Get group names error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}