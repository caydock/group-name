import { getDB } from '@/lib/db';
import { getLatestGroupNamesPaginated } from '@/lib/db/queries';
import { GroupNameCard } from '@/components/group-name/group-name-card';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { GoogleAd } from '@/components/layout/google-ad';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: '最新群名 ',
	description: '浏览最新提交的微信群名、QQ群名，发现最新的有趣群聊名称，紧跟流行趋势',
	keywords: '最新群名,最新微信群名,新群名,流行群名,群名推荐',
};

interface LatestPageProps {
	searchParams: Promise<{ page?: string }>;
}

export default async function LatestPage({ searchParams }: LatestPageProps) {
	const page = parseInt((await searchParams).page || '1');
	const db = getDB();
	const result = await getLatestGroupNamesPaginated(db, page, 40);

	return (
		<div className="min-h-screen bg-white">
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Breadcrumb items={[{ label: '最新群名' }]} />

				<div className="flex items-center justify-center gap-2 mt-8 mb-8">
					<Clock className="h-6 w-6 text-gray-700" />
					<h1 className="text-2xl font-bold text-gray-900">最新群名</h1>
				</div>

				<p className="text-sm text-gray-600 mb-6 text-center">
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

				{result.total > 0 && (
					<div className="flex justify-center gap-2">
						{page > 1 && (
							<Link
								href={`/latest?page=${page - 1}`}
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
								href={`/latest?page=${page + 1}`}
								className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
							>
								下一页
							</Link>
						)}
					</div>
				)}

				<GoogleAd />
		</main>
		</div>
	);
}