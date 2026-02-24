import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { incrementLikeCount } from '@/lib/db/queries';

export async function POST(request: Request) {
	try {
		const body = await request.json() as { id?: number };
		const { id } = body;

		if (!id) {
			return NextResponse.json(
				{ error: '群名ID不能为空' },
				{ status: 400 }
			);
		}

		const db = getDB();
		await incrementLikeCount(db, id);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error incrementing like count:', error);
		// 返回 200 而不是 500，避免影响前端体验
		return NextResponse.json({ success: false, error: '操作失败' }, { status: 200 });
	}
}