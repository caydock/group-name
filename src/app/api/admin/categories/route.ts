import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { createCategory, getAllCategories } from '@/lib/db/queries';
import { cookies } from 'next/headers';

export async function GET() {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get('admin_session');

		if (!session) {
			return NextResponse.json({ error: '未授权' }, { status: 401 });
		}

		const db = getDB();
		const categories = await getAllCategories(db);

		return NextResponse.json(categories);
	} catch (error) {
		console.error('Get categories error:', error);
		return NextResponse.json({ error: '获取失败' }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get('admin_session');

		if (!session) {
			return NextResponse.json({ error: '未授权' }, { status: 401 });
		}

		const { name, description, icon, sortOrder } = await request.json() as {
			name?: string;
			description?: string;
			icon?: string;
			sortOrder?: number;
		};

		if (!name) {
			return NextResponse.json({ error: '分类名称不能为空' }, { status: 400 });
		}

		const db = getDB();
		const result = await createCategory(db, {
			name,
			description,
			icon,
			sortOrder: sortOrder ?? 0,
		});

		return NextResponse.json({ success: true, id: result.id });
	} catch (error) {
		console.error('Create category error:', error);
		return NextResponse.json({ error: '创建失败' }, { status: 500 });
	}
}
