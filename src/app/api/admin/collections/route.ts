import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { createCollection, getAllCollections } from '@/lib/db/queries';
import { cookies } from 'next/headers';

export async function GET() {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get('admin_session');

		if (!session) {
			return NextResponse.json({ error: '未授权' }, { status: 401 });
		}

		const db = getDB();
		const collections = await getAllCollections(db);

		return NextResponse.json(collections);
	} catch (error) {
		console.error('Get collections error:', error);
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

		const { name, description, coverImage, isFeatured } = await request.json() as {
			name?: string;
			description?: string;
			coverImage?: string;
			isFeatured?: boolean;
		};

		if (!name) {
			return NextResponse.json({ error: '合集名称不能为空' }, { status: 400 });
		}

		const db = getDB();
		const result = await createCollection(db, {
			name,
			description,
			coverImage,
			isFeatured: isFeatured ?? false,
		});

		return NextResponse.json({ success: true, id: result.id });
	} catch (error) {
		console.error('Create collection error:', error);
		return NextResponse.json({ error: '创建失败' }, { status: 500 });
	}
}
