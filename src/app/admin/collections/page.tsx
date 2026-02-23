import { getDB } from '@/lib/db';
import { getAllCollections } from '@/lib/db/queries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '合集管理 - 管理后台',
	description: '管理群名合集，查看和编辑合集信息',
};

interface CollectionItem {
	id: number;
	name: string;
	description: string | null;
	coverImage: string | null;
	isFeatured: boolean;
	groupNamesCount: number;
	sortOrder: number;
}

export default async function CollectionsPage() {
	const db = getDB();
	const collections: CollectionItem[] = await getAllCollections(db) as unknown as CollectionItem[];

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">合集管理</h1>
				<span className="text-sm text-gray-600">
					共 {collections.length} 个合集
				</span>
			</div>

			<div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead>
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								名称
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								描述
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								群名数
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								精选
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								排序
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{collections.map((collection) => (
							<tr key={collection.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{collection.name}
								</td>
								<td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
									{collection.description || '-'}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{collection.groupNamesCount}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{collection.isFeatured ? (
										<span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
											是
										</span>
									) : (
										<span className="text-gray-400">否</span>
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
									{collection.sortOrder}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
				<p className="text-sm text-blue-800">
					ℹ️ 合集管理功能开发中，目前只能查看现有合集。如需添加或修改合集，请联系开发者。
				</p>
			</div>
		</div>
	);
}