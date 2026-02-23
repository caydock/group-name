import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { updateCategory, deleteCategory } from '@/lib/db/queries';
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
		await updateCategory(db, id, {
			name,
			description,
			icon,
			sortOrder,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Update category error:', error);
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

		await deleteCategory(db, id);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Delete category error:', error);
		return NextResponse.json({ error: '删除失败' }, { status: 500 });
	}
}
