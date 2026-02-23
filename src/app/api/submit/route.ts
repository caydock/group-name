import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { createGroupName } from '@/lib/db/queries';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
	try {
		const body = await request.json() as { name?: string; categoryId?: number };
		const { name, categoryId } = body;

		if (!name || !name.trim()) {
			return NextResponse.json(
				{ error: '群名不能为空' },
				{ status: 400 }
			);
		}

		if (name.length > 50) {
			return NextResponse.json(
				{ error: '群名长度不能超过50个字符' },
				{ status: 400 }
			);
		}

		if (!categoryId) {
			return NextResponse.json(
				{ error: '请选择分类' },
				{ status: 400 }
			);
		}

		const db = getDB();
		const userId = nanoid();
		
		await createGroupName(db, {
			name: name.trim(),
			categoryId,
			userId,
		});

		return NextResponse.json(
			{ success: true, message: '提交成功，等待审核' },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error submitting group name:', error);
		return NextResponse.json(
			{ error: '提交失败，请稍后重试' },
			{ status: 500 }
		);
	}
}