import { getDB } from '@/lib/db';
import { getAllCategories } from '@/lib/db/queries';
import { CategoryCard } from '@/components/group-name/category-card';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { GoogleAd } from '@/components/layout/google-ad';
import { Folder } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: '群名分类 ',
	description: '浏览所有群名分类，包括搞笑、文艺、商务、家庭、校园、游戏等各种风格分类，快速找到您喜欢的群聊名称',
	keywords: '群名分类,微信群名分类,搞笑群名,文艺群名,商务群名,家庭群名,校园群名,游戏群名',
};

export default async function CategoriesPage() {
	const db = getDB();
	const categories = await getAllCategories(db);

	return (
		<div className="min-h-screen bg-white">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Breadcrumb items={[{ label: '分类' }]} />

				<GoogleAd />

				<div className="flex items-center justify-center gap-2 mt-8 mb-8">
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