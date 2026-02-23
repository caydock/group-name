import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { updateGroupNameCategory, updateGroupNameCollection } from '@/lib/db/queries';
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
		const { categoryId, collectionId } = await request.json() as {
			categoryId?: number | null;
			collectionId?: number | null;
		};

		const db = getDB();

		if (categoryId !== undefined) {
			await updateGroupNameCategory(db, id, categoryId);
		}

		if (collectionId !== undefined) {
			await updateGroupNameCollection(db, id, collectionId);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Update group name error:', error);
		return NextResponse.json({ error: '更新失败' }, { status: 500 });
	}
}
