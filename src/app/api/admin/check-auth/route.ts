import { cookies } from 'next/headers';

export async function GET() {
	const cookieStore = await cookies();
	const session = cookieStore.get('admin_session');

	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	return new Response('OK', { status: 200 });
}