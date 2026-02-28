import { getDB } from '@/lib/db';
import { getGroupNamesByCollection, getCollectionById } from '@/lib/db/queries';
import { GroupNameCard } from '@/components/group-name/group-name-card';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { GoogleAd } from '@/components/layout/google-ad';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface CollectionPageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
	const db = getDB();
	const { id } = await params;
	const collection = await getCollectionById(db, parseInt(id));

	if (!collection) {
		return {
			title: '合集不存在',
		};
	}

	return {
		title: `${collection.name} - 群名合集`,
		description: collection.description || `查看${collection.name}合集下的所有群名`,
		keywords: `${collection.name},群名合集,微信群名,QQ群名,${collection.name}群名`,
	};
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
	const db = getDB();
	const { id } = await params;
	const collectionId = parseInt(id);
	const page = parseInt((await searchParams).page || '1');
	
	const [collection, result] = await Promise.all([
		getCollectionById(db, collectionId),
		getGroupNamesByCollection(db, collectionId, page, 20),
	]);

	if (!collection) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-white">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Breadcrumb items={[
					{ label: '合集', href: '/collections' },
					{ label: collection.name }
				]} />

				<GoogleAd align="left" />

				<div className="flex items-start gap-4 mt-4 mb-4">
					<div className="flex-1">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							{collection.name}
						</h1>
						{collection.description && (
							<p className="text-gray-600">{collection.description}</p>
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
								href={`/collections/${collectionId}?page=${page - 1}`}
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
								href={`/collections/${collectionId}?page=${page + 1}`}
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