import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { updateGroupName, deleteGroupName } from '@/lib/db/queries';
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
		const { name, categoryId, collectionId, status } = await request.json() as {
			name?: string;
			categoryId?: number | null;
			collectionId?: number | null;
			status?: 'pending' | 'approved' | 'rejected';
		};

		if (!name) {
			return NextResponse.json({ error: '群名不能为空' }, { status: 400 });
		}

		const db = getDB();
		await updateGroupName(db, id, {
			name,
			categoryId,
			collectionId,
			status,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Update group name error:', error);
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

		await deleteGroupName(db, id);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Delete group name error:', error);
		return NextResponse.json({ error: '删除失败' }, { status: 500 });
	}
}
