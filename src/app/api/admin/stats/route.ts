import { cookies } from 'next/headers';
import { getDB } from '@/lib/db';
import { getDashboardStats } from '@/lib/db/queries';

export async function GET() {
	const cookieStore = await cookies();
	const session = cookieStore.get('admin_session');

	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	const db = getDB();
	const stats = await getDashboardStats(db);

	return Response.json(stats);
}