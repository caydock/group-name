import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { eq, and, desc } from 'drizzle-orm';
import { collections, groupNames, categories } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

// 获取所有合集
export async function GET() {
  try {
    const db = getDB();
    const allCollections = await db.select().from(collections);
    
    // 为每个合集获取群名数量
    const collectionsWithCount = await Promise.all(
      allCollections.map(async (collection) => {
        const count = await db.select().from(groupNames).where(eq(groupNames.collectionId, collection.id));
        
        return {
          ...collection,
          groupNamesCount: count.length || 0
        };
      })
    );
    
    return NextResponse.json(collectionsWithCount);
  } catch (error) {
    console.error('Get collections error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}