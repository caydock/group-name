import { getDB } from '@/lib/db';
import { getAllCollections } from '@/lib/db/queries';
import { CollectionCard } from '@/components/group-name/collection-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '全部合集',
	description: '精选群名合集，按主题整理的群名集合',
};

export default async function CollectionsPage() {
	const db = getDB();
	const collections = await getAllCollections(db);

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