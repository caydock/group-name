import { cookies } from 'next/headers';
import { getDB } from '@/lib/db';
import { getAllGroupNames } from '@/lib/db/queries';
import { groupNames } from '@/lib/db/schema';

export async function GET(request: Request) {
	const cookieStore = await cookies();
	const session = cookieStore.get('admin_session');

	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const page = parseInt(searchParams.get('page') || '1');
	const limit = parseInt(searchParams.get('limit') || '20');
	const statusParam = searchParams.get('status');
	const status: 'pending' | 'approved' | 'rejected' | undefined = statusParam as any;
	const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined;
	const collectionId = searchParams.get('collectionId') ? parseInt(searchParams.get('collectionId')!) : undefined;
	const search = searchParams.get('search') || undefined;

	const db = getDB();
	const result = await getAllGroupNames(db, page, limit, { status, categoryId, collectionId, search });

	return Response.json(result);
}

export async function POST(request: Request) {
	const cookieStore = await cookies();
	const session = cookieStore.get('admin_session');

	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		const body = await request.json() as { name?: string; categoryId?: string; collectionId?: string };
		const { name, categoryId, collectionId } = body;

		if (!name) {
			return Response.json({ error: '群名不能为空' }, { status: 400 });
		}

		const db = getDB();
		await db.insert(groupNames).values({
			name,
			status: 'approved',
			categoryId: categoryId ? parseInt(categoryId) : null,
			collectionId: collectionId ? parseInt(collectionId) : null,
		});

		return Response.json({ success: true });
	} catch (error) {
		console.error('添加群名失败:', error);
		return Response.json({ error: '添加群名失败' }, { status: 500 });
	}
}