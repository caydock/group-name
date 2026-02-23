import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { deleteGroupName, getAllGroupNames } from '@/lib/db/queries';
import { cookies } from 'next/headers';

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
