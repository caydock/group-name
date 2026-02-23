import { getDB } from '@/lib/db';
import { getAllCategories } from '@/lib/db/queries';

export default async function CategoriesPage() {
	const db = getDB();
	const categories = await getAllCategories(db);

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
				<span className="text-sm text-gray-600">
					共 {categories.length} 个分类
				</span>
			</div>

			<div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead>
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								图标
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								名称
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								描述
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								排序
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{categories.map((category) => (
							<tr key={category.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap">
									<span className="text-2xl">{category.icon}</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{category.name}
								</td>
								<td className="px-6 py-4 text-sm text-gray-500">
									{category.description || '-'}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
									{category.sortOrder}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
				<p className="text-sm text-blue-800">
					ℹ️ 分类管理功能开发中，目前只能查看现有分类。如需添加或修改分类，请联系开发者。
				</p>
			</div>
		</div>
	);
}