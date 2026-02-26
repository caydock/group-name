import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { categories } from '@/lib/db/schema';

// 获取所有分类
export async function GET() {
  try {
    const db = getDB();
    const allCategories = await db.select().from(categories);
    
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
  }
}