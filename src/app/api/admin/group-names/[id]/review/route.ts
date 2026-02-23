import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { reviewGroupName } from '@/lib/db/queries';

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const body = await request.json() as { status?: string };
		const { status } = body;

		if (!status || !['approved', 'rejected'].includes(status)) {
			return NextResponse.json(
				{ error: '无效的审核状态' },
				{ status: 400 }
			);
		}

		const db = getDB();
		const groupNameId = parseInt(id);
		
		await reviewGroupName(db, groupNameId, status as 'approved' | 'rejected');

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error reviewing group name:', error);
		return NextResponse.json(
			{ error: '审核失败' },
			{ status: 500 }
		);
	}
}