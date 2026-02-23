import { cookies } from 'next/headers';
import { getDB } from '@/lib/db';
import { getPendingGroupNames } from '@/lib/db/queries';

export async function GET(request: Request) {
	const cookieStore = await cookies();
	const session = cookieStore.get('admin_session');

	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const page = parseInt(searchParams.get('page') || '1');
	const limit = parseInt(searchParams.get('limit') || '10');

	const db = getDB();
	const result = await getPendingGroupNames(db, page, limit);

	return Response.json(result);
}