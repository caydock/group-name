import { getDB } from '@/lib/db';
import { getPendingGroupNames } from '@/lib/db/queries';
import { Button } from '@/components/ui/button';
import { PendingGroupNamesTable } from '@/components/admin/pending-group-names-table';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '群名审核 - 管理后台',
	description: '审核用户提交的群名，批准或拒绝提交内容',
};

interface GroupNamesPageProps {
	searchParams: Promise<{ page?: string }>;
}

export default async function GroupNamesPage({ searchParams }: GroupNamesPageProps) {
	const page = parseInt((await searchParams).page || '1');
	const db = getDB();
	const result = await getPendingGroupNames(db, page, 20);

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">群名审核</h1>
				{result.total > 0 && (
					<div className="text-sm text-gray-600">
						待审核: {result.total} 条
					</div>
				)}
			</div>

			{result.data.length === 0 ? (
				<div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
					<div className="text-6xl mb-4">✅</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						没有待审核的群名
					</h3>
					<p className="text-gray-600">
						所有提交的群名都已审核完成
					</p>
				</div>
			) : (
				<>
					<div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
						<PendingGroupNamesTable groupNames={result.data} />
					</div>

					{result.total > result.pageSize && (
						<div className="flex justify-center gap-2 mt-6">
							{page > 1 && (
								<a
									href={`/admin/group-names?page=${page - 1}`}
									className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
								>
									上一页
								</a>
							)}
							<span className="px-4 py-2 text-gray-600">
								第 {page} 页 / 共 {Math.ceil(result.total / result.pageSize)} 页
							</span>
							{page < Math.ceil(result.total / result.pageSize) && (
								<a
									href={`/admin/group-names?page=${page + 1}`}
									className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
								>
									下一页
								</a>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}