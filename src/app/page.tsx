import { getDB } from '@/lib/db';
import { getLatestGroupNames, getPopularGroupNames, getAllCategories, getFeaturedCollections } from '@/lib/db/queries';
import { GroupNameCard } from '@/components/group-name/group-name-card';
import { CategoryCard } from '@/components/group-name/category-card';
import { CollectionCard } from '@/components/group-name/collection-card';
import { SearchInput } from '@/components/search-input';
import { TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '群名大全 - 有趣的微信群名、QQ群名、群聊名称大全',
	description: '群名大全提供海量有趣的微信群名、QQ群名、群聊名称，包括搞笑、文艺、商务、家庭、校园、游戏等各种分类，支持按分类浏览、查看最新和热门群名，一键复制使用',
	keywords: '群名大全,微信群名,QQ群名,群聊名称,搞笑群名,文艺群名,群名推荐,群名大全',
};

export default async function HomePage() {
	const db = getDB();
	
	const [latestNames, popularNames, categories, featuredCollections] = await Promise.all([
		getLatestGroupNames(db, 12),
		getPopularGroupNames(db, 12),
		getAllCategories(db),
		getFeaturedCollections(db, 6),
	]);

	return (
		<div className="min-h-screen bg-white">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<section className="text-center py-12 mb-12 bg-gradient-to-b from-gray-50 to-white">
					<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						有趣的微信群名，一触即得
					</h1>
					<p className="text-lg text-gray-600 mb-8">
						发现、复制和分享有趣的微信群名
					</p>
					<SearchInput />
				</section>

				<section className="mb-12">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-gray-900">分类浏览</h2>
						<Link href="/categories" className="text-gray-600 hover:text-gray-900">
							查看更多 →
						</Link>
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
				</section>

				<section className="mb-12">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-2">
							<Clock className="h-6 w-6 text-gray-700" />
							<h2 className="text-2xl font-bold text-gray-900">最新群名</h2>
						</div>
						<Link href="/latest" className="text-gray-600 hover:text-gray-900">
							查看更多 →
						</Link>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{latestNames.map((item: any) => (
							<GroupNameCard
								key={item.id}
								id={item.id}
								name={item.name}
								category={item.category}
								views={item.views}
								likes={item.likes}
								copies={item.copies}
							/>
						))}
					</div>
				</section>

				<section className="mb-12">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-2">
							<TrendingUp className="h-6 w-6 text-gray-700" />
							<h2 className="text-2xl font-bold text-gray-900">热门群名</h2>
						</div>
						<Link href="/popular" className="text-gray-600 hover:text-gray-900">
							查看更多 →
						</Link>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{popularNames.map((item: any) => (
							<GroupNameCard
								key={item.id}
								id={item.id}
								name={item.name}
								category={item.category}
								views={item.views}
								likes={item.likes}
								copies={item.copies}
							/>
						))}
					</div>
				</section>

				{featuredCollections.length > 0 && (
					<section className="mb-12">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-gray-900">精选合集</h2>
							<Link href="/collections" className="text-gray-600 hover:text-gray-900">
								查看更多 →
							</Link>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
							{featuredCollections.map((collection: any) => (
								<CollectionCard
									key={collection.id}
									id={collection.id}
									name={collection.name}
									description={collection.description}
									coverImage={collection.coverImage}
									groupNamesCount={collection.groupNamesCount}
								/>
							))}
						</div>
					</section>
				)}
			</main>

			<footer className="border-t border-border mt-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<p className="text-gray-600 text-sm">
							© 2025 群名大全. 保留所有权利.
						</p>
						<div className="flex items-center gap-6 text-sm text-gray-600">
							<Link href="/" className="hover:text-gray-900">
								首页
							</Link>
							<Link href="/categories" className="hover:text-gray-900">
								分类
							</Link>
							<Link href="/collections" className="hover:text-gray-900">
								合集
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}