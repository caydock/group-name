'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, Home, Folder, Layers, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Header() {
	const pathname = usePathname();
	const isHomePage = pathname === '/';
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="border-b border-gray-200 sticky top-0 bg-white z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						<Link href="/" className="flex items-center gap-2">
							<img src="/images/logo-64x64.jpg" alt="群名小岛" className="h-10 w-10 object-cover rounded-lg" />
							<span className="text-2xl font-bold text-gray-900">群名小岛</span>
						</Link>
					</div>

					<>
						<nav className="hidden md:flex items-center gap-6">
							<Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
								<Home className="h-4 w-4 mr-1" />
								首页
							</Link>
							<Link href="/categories" className="flex items-center text-gray-600 hover:text-gray-900">
								<Folder className="h-4 w-4 mr-1" />
								分类
							</Link>
							<Link href="/collections" className="flex items-center text-gray-600 hover:text-gray-900">
								<Layers className="h-4 w-4 mr-1" />
								合集
							</Link>
							<Link href="/submit" className="flex items-center text-gray-600 hover:text-gray-900">
								<Plus className="h-4 w-4 mr-1" />
								提交群名
							</Link>
						</nav>
						<div className="flex items-center gap-3">
							<div className="relative hidden sm:block">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
								<Input
									type="search"
									placeholder="搜索群名..."
									className="pl-10 w-64"
									suppressHydrationWarning
								/>
							</div>
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="md:hidden p-2 rounded-md hover:bg-gray-100"
							>
								{mobileMenuOpen ? (
									<X className="h-6 w-6 text-gray-600" />
								) : (
									<Menu className="h-6 w-6 text-gray-600" />
								)}
							</button>
						</div>
					</>
				</div>
			</div>
			{mobileMenuOpen && (
				<div className="md:hidden border-t border-border bg-card">
					<nav className="px-4 py-4 space-y-3">
						<Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 py-2">
							<Home className="h-4 w-4 mr-2" />
							首页
						</Link>
						<Link href="/categories" className="flex items-center text-gray-600 hover:text-gray-900 py-2">
							<Folder className="h-4 w-4 mr-2" />
							分类
						</Link>
						<Link href="/collections" className="flex items-center text-gray-600 hover:text-gray-900 py-2">
							<Layers className="h-4 w-4 mr-2" />
							合集
						</Link>
						<Link href="/submit" className="flex items-center text-gray-600 hover:text-gray-900 py-2">
							<Plus className="h-4 w-4 mr-2" />
							提交群名
						</Link>
						<div className="relative pt-2">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
							<Input
								type="search"
								placeholder="搜索群名..."
								className="pl-10 w-full"
								suppressHydrationWarning
							/>
						</div>
					</nav>
				</div>
			)}
		</header>
	);
}