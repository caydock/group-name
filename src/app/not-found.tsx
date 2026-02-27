import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
	return (
		<div className="min-h-screen bg-white flex items-center justify-center px-4">
			<div className="text-center">
				<div className="text-9xl font-bold text-gray-900 mb-4">404</div>
				<h1 className="text-2xl font-semibold text-gray-900 mb-2">
					页面不存在
				</h1>
				<p className="text-gray-600 mb-8">
					抱歉，您访问的页面不存在或已被删除
				</p>
				<div className="flex items-center justify-center gap-4">
					<Link href="/">
						<Button>
							<Home className="h-4 w-4 mr-2" />
							返回首页
						</Button>
					</Link>
					<Link href="/categories">
						<Button variant="outline">
							<Search className="h-4 w-4 mr-2" />
							浏览分类
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
