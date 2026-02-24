'use client';

import { useState, useEffect } from 'react';
import { DeleteButton } from '@/components/admin/delete-button';
import { Pencil } from 'lucide-react';

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
	const [editingId, setEditingId] = useState<number | null>(null);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [filters, setFilters] = useState({
		status: '',
		categoryId: '',
		collectionId: '',
		search: '',
	});
	const [editForm, setEditForm] = useState({
		name: '',
		categoryId: '',
		collectionId: '',
		status: 'pending' as 'pending' | 'approved' | 'rejected',
	});
	const [submitting, setSubmitting] = useState(false);
	const [editError, setEditError] = useState('');

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

	const handleEdit = (item: GroupNameItem) => {
		setEditingId(item.id);
		setEditForm({
			name: item.name,
			categoryId: item.category?.id?.toString() || '',
			collectionId: item.collection?.id?.toString() || '',
			status: item.status,
		});
	};

	const handleUpdate = async (e: React.FormEvent, id: number) => {
		e.preventDefault();
		setEditError('');
		setSubmitting(true);

		try {
			const res = await fetch(`/api/admin/group-names/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...editForm,
					categoryId: editForm.categoryId ? parseInt(editForm.categoryId) : null,
					collectionId: editForm.collectionId ? parseInt(editForm.collectionId) : null,
				}),
			});

			if (!res.ok) {
				const data = await res.json() as { error?: string };
				throw new Error(data.error || '更新失败');
			}

			setEditingId(null);
			setEditForm({ name: '', categoryId: '', collectionId: '', status: 'pending' });
			loadData();
		} catch (err) {
			setEditError(err instanceof Error ? err.message : '更新失败，请重试');
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setEditForm({ name: '', categoryId: '', collectionId: '', status: 'pending' });
		setEditError('');
	};

	const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setEditForm({ ...editForm, [e.target.name]: e.target.value });
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900 hidden sm:block">群名管理</h1>
				<span className="text-sm text-gray-600">
					共 {total} 条
				</span>
			</div>

			<form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
					<div className="bg-white border border-gray-200 rounded-lg overflow-hidden hidden sm:block">
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
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
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
									{editingId === item.id ? (
										<input
											name="name"
											type="text"
											value={editForm.name}
											onChange={handleEditFormChange}
											className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
											required
										/>
									) : (
										item.name
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{editingId === item.id ? (
										<select
											name="categoryId"
											value={editForm.categoryId}
											onChange={handleEditFormChange}
											className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
										>
											<option value="">无分类</option>
											{categories.map((cat) => (
												<option key={cat.id} value={cat.id}>{cat.name}</option>
											))}
										</select>
									) : (
										item.category ? `${item.category.icon || ''} ${item.category.name}` : '-'
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{editingId === item.id ? (
										<select
											name="collectionId"
											value={editForm.collectionId}
											onChange={handleEditFormChange}
											className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
										>
											<option value="">无合集</option>
											{collections.map((col) => (
												<option key={col.id} value={col.id}>{col.name}</option>
											))}
										</select>
									) : (
										item.collection?.name || '-'
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{editingId === item.id ? (
										<select
											name="status"
											value={editForm.status}
											onChange={handleEditFormChange}
											className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
										>
											<option value="pending">待审核</option>
											<option value="approved">已通过</option>
											<option value="rejected">已拒绝</option>
										</select>
									) : (
										<span className={`px-2 py-1 text-xs rounded-full ${
											item.status === 'approved' ? 'bg-green-100 text-green-800' :
											item.status === 'rejected' ? 'bg-red-100 text-red-800' :
											'bg-yellow-100 text-yellow-800'
										}`}>
											{item.status === 'approved' ? '已通过' :
											item.status === 'rejected' ? '已拒绝' : '待审核'}
										</span>
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
									{item.views}/{item.likes}/{item.copies}
								</td>
								<td className="px-6 py-4 text-right text-sm font-medium w-48">
									<div className="flex justify-end gap-2 flex-wrap">
										{editingId === item.id ? (
											<>
												<button
													onClick={handleCancelEdit}
													className="px-3 py-1.5 border border-gray-400 bg-white text-gray-700 hover:bg-gray-100 rounded text-sm"
												>
													取消
												</button>
												<button
													onClick={(e) => handleUpdate(e, item.id)}
													className="px-3 py-1.5 border border-black bg-black text-white hover:bg-gray-800 rounded font-medium text-sm"
													disabled={submitting}
												>
													{submitting ? '保存中...' : '保存'}
												</button>
												<DeleteButton
													action={`/api/admin/group-names/${item.id}`}
													className="px-3 py-1.5 border border-gray-400 bg-white text-gray-700 hover:bg-gray-100 rounded text-sm"
													onSuccess={loadData}
												>
													删除
												</DeleteButton>
											</>
										) : (
											<button
												onClick={() => handleEdit(item)}
												className="px-3 py-1.5 border border-black bg-black text-white hover:bg-gray-800 rounded flex items-center gap-1 font-medium text-sm"
											>
												<Pencil className="h-4 w-4" />
												编辑
											</button>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
						</table>
					</div>

					<div className="sm:hidden space-y-4">
						{groupNames.map((item) => (
							<div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
								{editingId === item.id ? (
									<form onSubmit={(e) => handleUpdate(e, item.id)} className="space-y-3">
										{editError && (
											<div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600">
												{editError}
											</div>
										)}
										<div className="text-xs text-gray-500">ID: {item.id}</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">群名</label>
											<input
												name="name"
												type="text"
												value={editForm.name}
												onChange={handleEditFormChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-md"
												required
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
											<select
												name="categoryId"
												value={editForm.categoryId}
												onChange={handleEditFormChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-md"
											>
												<option value="">无分类</option>
												{categories.map((cat) => (
													<option key={cat.id} value={cat.id}>{cat.name}</option>
												))}
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">合集</label>
											<select
												name="collectionId"
												value={editForm.collectionId}
												onChange={handleEditFormChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-md"
											>
												<option value="">无合集</option>
												{collections.map((col) => (
													<option key={col.id} value={col.id}>{col.name}</option>
												))}
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
											<select
												name="status"
												value={editForm.status}
												onChange={handleEditFormChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-md"
											>
												<option value="pending">待审核</option>
												<option value="approved">已通过</option>
												<option value="rejected">已拒绝</option>
											</select>
										</div>
										<div className="flex gap-2">
											<button
												type="button"
												onClick={handleCancelEdit}
												className="flex-1 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md"
											>
												取消
											</button>
											<button
												type="submit"
												className="flex-1 px-4 py-2 border border-black bg-black text-white rounded-md disabled:bg-gray-400"
												disabled={submitting}
											>
												{submitting ? '保存中...' : '保存'}
											</button>
										</div>
										<DeleteButton
											action={`/api/admin/group-names/${item.id}`}
											className="w-full px-4 py-2 border border-red-500 bg-white text-red-600 rounded-md hover:bg-red-50"
											onSuccess={loadData}
										>
											删除
										</DeleteButton>
									</form>
								) : (
									<>
										<div className="flex justify-between items-start mb-3">
											<div>
												<div className="text-xs text-gray-500 mb-1">ID: {item.id}</div>
												<h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
											</div>
											<span className={`px-2 py-1 text-xs rounded-full ${
												item.status === 'approved' ? 'bg-green-100 text-green-800' :
												item.status === 'rejected' ? 'bg-red-100 text-red-800' :
												'bg-yellow-100 text-yellow-800'
											}`}>
												{item.status === 'approved' ? '已通过' :
												item.status === 'rejected' ? '已拒绝' : '待审核'}
											</span>
										</div>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-gray-600">分类:</span>
												<span className="text-gray-900">{item.category ? `${item.category.icon || ''} ${item.category.name}` : '-'}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600">合集:</span>
												<span className="text-gray-900">{item.collection?.name || '-'}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-gray-600">浏览/点赞/复制:</span>
												<span className="text-gray-900">{item.views}/{item.likes}/{item.copies}</span>
											</div>
										</div>
										<div className="mt-4 pt-4 border-t border-gray-100">
											<button
												onClick={() => handleEdit(item)}
												className="w-full text-center px-4 py-3 border-2 border-black bg-black text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center gap-1 font-medium text-base"
											>
												<Pencil className="h-5 w-5" />
												编辑
											</button>
										</div>
									</>
								)}
							</div>
						))}
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