import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Folder, BookOpen, CheckCircle, BarChart3 } from 'lucide-react';

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white border-b border-gray-200 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center gap-4">
							<Link href="/" className="text-xl font-bold text-gray-900">
								群名大全
							</Link>
							<span className="text-gray-300">|</span>
							<span className="text-gray-600">后台管理</span>
						</div>
						<Button variant="outline" size="sm" asChild>
							<Link href="/">
								<Home className="h-4 w-4 mr-2" />
								返回首页
							</Link>
						</Button>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex gap-8">
					<aside className="w-48 flex-shrink-0">
						<nav className="space-y-1">
							<Link
								href="/admin"
								className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-900 bg-gray-100"
							>
								<BarChart3 className="h-4 w-4" />
								数据统计
							</Link>
							<Link
								href="/admin/group-names"
								className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
							>
								<CheckCircle className="h-4 w-4" />
								群名审核
							</Link>
							<Link
								href="/admin/categories"
								className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
							>
								<Folder className="h-4 w-4" />
								分类管理
							</Link>
							<Link
								href="/admin/collections"
								className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
							>
								<BookOpen className="h-4 w-4" />
								合集管理
							</Link>
						</nav>
					</aside>
					<main className="flex-1 min-w-0">
						{children}
					</main>
				</div>
			</div>
		</div>
	);
}