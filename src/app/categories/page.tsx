import { getDB } from '@/lib/db';
import { getAllCategories } from '@/lib/db/queries';
import { CategoryCard } from '@/components/group-name/category-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Folder } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '全部分类',
	description: '浏览所有群名分类，包括搞笑、文艺、商务、家庭、校园、游戏等',
};

export default async function CategoriesPage() {
	const db = getDB();
	const categories = await getAllCategories(db);

	return (
		<div className="min-h-screen bg-white">
			<header className="border-b border-gray-200 sticky top-0 bg-white z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<Button variant="ghost" size="sm" asChild>
							<Link href="/">
								<ArrowLeft className="h-4 w-4 mr-2" />
								返回首页
							</Link>
						</Button>
						<Link href="/" className="text-xl font-bold text-gray-900">
							群名大全
						</Link>
						<div className="w-20" />
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center gap-2 mb-8">
					<Folder className="h-6 w-6 text-gray-700" />
					<h1 className="text-2xl font-bold text-gray-900">所有分类</h1>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
					{categories.map((category: any) => (
						<CategoryCard
							key={category.id}
							id={category.id}
							name={category.name}
							icon={category.icon || undefined}
						/>
					))}
				</div>
			</main>
		</div>
	);
}