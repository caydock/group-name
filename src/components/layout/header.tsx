'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function Header() {
	const pathname = usePathname();
	const isHomePage = pathname === '/';
	const showSearch = !isHomePage;

	return (
		<header className="border-b border-gray-200 sticky top-0 bg-white z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						{!isHomePage && (
							<Button variant="ghost" size="sm" asChild className="mr-4">
								<Link href="/" className="flex items-center">
									<ArrowLeft className="h-4 w-4 mr-2" />
									返回首页
								</Link>
							</Button>
						)}
						<Link href="/" className="text-2xl font-bold text-gray-900">
							群名大全
						</Link>
					</div>

					{isHomePage ? (
						<>
							<nav className="hidden md:flex items-center gap-6">
								<Link href="/" className="text-gray-600 hover:text-gray-900">
									首页
								</Link>
								<Link href="/categories" className="text-gray-600 hover:text-gray-900">
									分类
								</Link>
								<Link href="/collections" className="text-gray-600 hover:text-gray-900">
									合集
								</Link>
							</nav>
							<div className="flex items-center gap-3">
								<div className="relative hidden sm:block">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
									<Input
										type="search"
										placeholder="搜索群名..."
										className="pl-10 w-64"
									/>
								</div>
								<Button asChild>
									<Link href="/submit">
										<Plus className="h-4 w-4 mr-2" />
										提交群名
									</Link>
								</Button>
							</div>
						</>
					) : (
						<div className="flex items-center gap-3">
							{showSearch && (
								<div className="relative hidden sm:block">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
									<Input
										type="search"
										placeholder="搜索群名..."
										className="pl-10 w-64"
									/>
								</div>
							)}
							<Button asChild>
								<Link href="/submit">
									<Plus className="h-4 w-4 mr-2" />
									提交群名
								</Link>
							</Button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}