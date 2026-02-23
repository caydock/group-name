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
		return NextResponse.json(
			{ error: '操作失败' },
			{ status: 500 }
		);
	}
}