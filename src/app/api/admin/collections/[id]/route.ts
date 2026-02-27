import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { updateCollection, deleteCollection } from '@/lib/db/queries';
import { cookies } from 'next/headers';

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get('admin_session');

		if (!session) {
			return NextResponse.json({ error: '未授权' }, { status: 401 });
		}

		const id = parseInt((await params).id);
		const { name, description, coverImage, sortOrder } = await request.json() as {
			name?: string;
			description?: string;
			coverImage?: string;
			sortOrder?: number;
		};

		if (!name) {
			return NextResponse.json({ error: '合集名称不能为空' }, { status: 400 });
		}

		const db = getDB();
		await updateCollection(db, id, {
			name,
			description,
			coverImage,
			sortOrder,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Update collection error:', error);
		return NextResponse.json({ error: '更新失败' }, { status: 500 });
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get('admin_session');

		if (!session) {
			return NextResponse.json({ error: '未授权' }, { status: 401 });
		}

		const id = parseInt((await params).id);
		const db = getDB();

		await deleteCollection(db, id);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Delete collection error:', error);
		return NextResponse.json({ error: '删除失败' }, { status: 500 });
	}
}
