import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
	try {
		const { token } = await request.json() as { token: string };

		if (!token) {
			return NextResponse.json({ error: '令牌不能为空' }, { status: 400 });
		}

		const adminToken = process.env.ADMIN_TOKEN;

		if (!adminToken) {
			return NextResponse.json({ error: '服务器配置错误' }, { status: 500 });
		}

		if (token !== adminToken) {
			return NextResponse.json({ error: '令牌错误' }, { status: 401 });
		}

		const session = crypto.randomBytes(32).toString('hex');
		const response = NextResponse.json({ success: true });
		response.cookies.set('admin_session', session, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7,
			path: '/',
		});

		return response;
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json({ error: '登录失败' }, { status: 500 });
	}
}
