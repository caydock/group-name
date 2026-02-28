import { getDB } from '@/lib/db';
import { getGroupNamesByCategory, getCategoryById } from '@/lib/db/queries';
import { GroupNameCard } from '@/components/group-name/group-name-card';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { GoogleAd } from '@/components/layout/google-ad';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
	const db = getDB();
	const { id } = await params;
	const category = await getCategoryById(db, parseInt(id));

	if (!category) {
		return {
			title: '分类不存在',
		};
	}

	return {
		title: `${category.name}群名`,
		description: category.description || `查看${category.name}分类下的所有群名`,
		keywords: `${category.name},群名,${category.name}群名`,
	};
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
	const db = getDB();
	const { id } = await params;
	const categoryId = parseInt(id);
	const page = parseInt((await searchParams).page || '1');
	
	const [category, result] = await Promise.all([
		getCategoryById(db, categoryId),
		getGroupNamesByCategory(db, categoryId, page, 20),
	]);

	if (!category) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-white">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Breadcrumb items={[
					{ label: '分类', href: '/categories' },
					{ label: category.name }
				]} />

				<GoogleAd />

				<div className="flex items-center gap-3 mt-4 mb-4">
					{category.icon && (
						<span className="text-4xl">{category.icon}</span>
					)}
					<div>
						<h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
						{category.description && (
							<p className="text-gray-600 mt-1">{category.description}</p>
						)}
					</div>
				</div>

				<p className="text-sm text-gray-600 mb-6">
					共 {result.total} 个群名
				</p>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
					{result.data.map((item: any) => (
						<GroupNameCard
							key={item.id}
							id={item.id}
							name={item.name}
							views={item.views}
							likes={item.likes}
							copies={item.copies}
						/>
					))}
				</div>

				{result.total > result.pageSize && (
					<div className="flex justify-center gap-2">
						{page > 1 && (
							<Link
								href={`/categories/${categoryId}?page=${page - 1}`}
								className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
							>
								上一页
							</Link>
						)}
						<span className="px-4 py-2 text-gray-600">
							第 {page} 页 / 共 {Math.ceil(result.total / result.pageSize)} 页
						</span>
						{page < Math.ceil(result.total / result.pageSize) && (
							<Link
								href={`/categories/${categoryId}?page=${page + 1}`}
								className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
							>
								下一页
							</Link>
						)}
					</div>
				)}
		</main>
		</div>
	);
}