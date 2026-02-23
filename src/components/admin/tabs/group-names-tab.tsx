'use client';

import { useState, useEffect } from 'react';
import { DeleteButton } from '@/components/admin/delete-button';

interface GroupNameItem {
	id: number;
	name: string;
	status: 'pending' | 'approved' | 'rejected';
	views: number;
	likes: number;
	copies: number;
	createdAt: Date;
	updatedAt: Date;
	category?: {
		id: number;
		name: string;
		icon: string | null;
	};
	collection?: {
		id: number;
		name: string;
	};
}

interface Category {
	id: number;
	name: string;
}

interface Collection {
	id: number;
	name: string;
}

interface PaginatedResult {
	data: GroupNameItem[];
	total: number;
	page: number;
	pageSize: number;
}

export function GroupNamesTab() {
	const [groupNames, setGroupNames] = useState<GroupNameItem[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [collections, setCollections] = useState<Collection[]>([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [filters, setFilters] = useState({
		status: '',
		categoryId: '',
		collectionId: '',
		search: '',
	});

	const pageSize = 20;

	useEffect(() => {
		loadData();
	}, [page, filters]);

	const loadData = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: pageSize.toString(),
				...filters,
			});

			const [groupNamesRes, categoriesRes, collectionsRes] = await Promise.all([
				fetch(`/api/admin/group-names?${params}`),
				fetch('/api/admin/categories'),
				fetch('/api/admin/collections'),
			]);

			if (groupNamesRes.ok && categoriesRes.ok && collectionsRes.ok) {
				const [groupNamesData, categoriesData, collectionsData] = await Promise.all([
					groupNamesRes.json() as Promise<PaginatedResult>,
					categoriesRes.json() as Promise<Category[]>,
					collectionsRes.json() as Promise<Collection[]>,
				]);
				setGroupNames(groupNamesData.data);
				setTotal(groupNamesData.total);
				setCategories(categoriesData);
				setCollections(collectionsData);
			}
		} catch (error) {
			console.error('加载数据失败:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleFilterChange = (key: string, value: string) => {
		setFilters({ ...filters, [key]: value });
		setPage(1);
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setPage(1);
		loadData();
	};

	const totalPages = Math.ceil(total / pageSize);

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">群名管理</h1>
				<span className="text-sm text-gray-600">
					共 {total} 条
				</span>
			</div>

			<form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
				<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
					<div>
						<label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
							状态
						</label>
						<select
							id="status"
							value={filters.status}
							onChange={(e) => handleFilterChange('status', e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">全部</option>
							<option value="pending">待审核</option>
							<option value="approved">已通过</option>
							<option value="rejected">已拒绝</option>
						</select>
					</div>

					<div>
						<label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
							分类
						</label>
						<select
							id="categoryId"
							value={filters.categoryId}
							onChange={(e) => handleFilterChange('categoryId', e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">全部分类</option>
							{categories.map((cat) => (
								<option key={cat.id} value={cat.id}>{cat.name}</option>
							))}
						</select>
					</div>

					<div>
						<label htmlFor="collectionId" className="block text-sm font-medium text-gray-700 mb-1">
							合集
						</label>
						<select
							id="collectionId"
							value={filters.collectionId}
							onChange={(e) => handleFilterChange('collectionId', e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">全部合集</option>
							{collections.map((col) => (
								<option key={col.id} value={col.id}>{col.name}</option>
							))}
						</select>
					</div>

					<div>
						<label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
							搜索
						</label>
						<div className="flex gap-2">
							<input
								id="search"
								type="text"
								className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="群名关键词"
								value={filters.search}
								onChange={(e) => handleFilterChange('search', e.target.value)}
							/>
							<button
								type="submit"
								className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
							>
								搜索
							</button>
						</div>
					</div>
				</div>
			</form>

			{loading ? (
				<div className="text-gray-600">加载中...</div>
			) : groupNames.length === 0 ? (
				<div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
					<div className="text-6xl mb-4">📭</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						没有找到群名
					</h3>
					<p className="text-gray-600">
						请尝试调整筛选条件
					</p>
				</div>
			) : (
				<>
					<div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
						<table className="min-w-full divide-y divide-gray-200">
							<thead>
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										ID
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										群名
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										分类
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										合集
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										状态
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										浏览/点赞/复制
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										操作
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{groupNames.map((item) => (
									<tr key={item.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{item.id}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{item.name}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{item.category ? `${item.category.icon || ''} ${item.category.name}` : '-'}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{item.collection?.name || '-'}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`px-2 py-1 text-xs rounded-full ${
												item.status === 'approved' ? 'bg-green-100 text-green-800' :
												item.status === 'rejected' ? 'bg-red-100 text-red-800' :
												'bg-yellow-100 text-yellow-800'
											}`}>
												{item.status === 'approved' ? '已通过' :
												item.status === 'rejected' ? '已拒绝' : '待审核'}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
											{item.views}/{item.likes}/{item.copies}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<DeleteButton
												action={`/api/admin/group-names/${item.id}`}
												className="text-red-600 hover:text-red-900"
												onSuccess={loadData}
											>
												删除
											</DeleteButton>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{total > pageSize && (
						<div className="flex justify-center gap-2 mt-6">
							{page > 1 && (
								<button
									onClick={() => setPage(page - 1)}
									className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
								>
									上一页
								</button>
							)}
							<span className="px-4 py-2 text-gray-600">
								第 {page} 页 / 共 {totalPages} 页
							</span>
							{page < totalPages && (
								<button
									onClick={() => setPage(page + 1)}
									className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
								>
									下一页
								</button>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
}