import { getDB } from '@/lib/db';
import { getAllCollections } from '@/lib/db/queries';
import { CollectionCard } from '@/components/group-name/collection-card';
import { BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: '群名合集 ',
	description: '精选群名合集，按主题整理的群名集合，包括搞笑合集、文艺合集、节日合集等，快速获取相关主题的群聊名称',
	keywords: '群名合集,群名收藏,精选群名,搞笑群名合集,文艺群名合集,群名推荐',
};

export default async function CollectionsPage() {
	const db = getDB();
	const collections = await getAllCollections(db);

	return (
		<div className="min-h-screen bg-white">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center gap-2 mb-8">
					<BookOpen className="h-6 w-6 text-gray-700" />
					<h1 className="text-2xl font-bold text-gray-900">所有合集</h1>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{collections.map((collection: any) => (
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
		</main>
		</div>
	);
}