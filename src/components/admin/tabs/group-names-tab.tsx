'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Select, Badge, Card } from 'antd';
import type { SelectProps } from 'antd';
import { DeleteButton } from '@/components/admin/delete-button';
import { Pencil, Search } from 'lucide-react';

const { Option } = Select;

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
	const [showAddForm, setShowAddForm] = useState(false);
	const [addForm, setAddForm] = useState({
		name: '',
		categoryId: '',
		collectionId: '',
	});
	const [addSubmitting, setAddSubmitting] = useState(false);
	const [addError, setAddError] = useState('');

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

	const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditForm({ ...editForm, [e.target.name]: e.target.value });
	};

	const handleAddSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setAddError('');
		setAddSubmitting(true);

		try {
			const res = await fetch('/api/admin/group-names', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(addForm),
			});

			if (!res.ok) {
				const data = await res.json() as { error?: string };
				throw new Error(data.error || '添加失败');
			}

			setAddForm({ name: '', categoryId: '', collectionId: '' });
			setShowAddForm(false);
			loadData();
		} catch (err) {
			setAddError(err instanceof Error ? err.message : '添加失败，请重试');
		} finally {
			setAddSubmitting(false);
		}
	};

	const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAddForm({ ...addForm, [e.target.name]: e.target.value });
	};

	const handleCancelAdd = () => {
		setAddForm({ name: '', categoryId: '', collectionId: '' });
		setAddError('');
		setShowAddForm(false);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-foreground hidden sm:block">群名管理</h1>
				<span className="text-sm text-muted-foreground">
					共 {total} 条
				</span>
			</div>

			<Card className="mb-6">
				<form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<div>
						<label htmlFor="status" className="block text-sm font-medium text-foreground mb-1">
							状态
						</label>
						<Select
							value={filters.status || 'all'}
							onChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
							placeholder="全部"
						>
							<Option value="all">全部</Option>
							<Option value="pending">待审核</Option>
							<Option value="approved">已通过</Option>
							<Option value="rejected">已拒绝</Option>
						</Select>
					</div>

					<div>
						<label htmlFor="categoryId" className="block text-sm font-medium text-foreground mb-1">
							分类
						</label>
						<Select
							value={filters.categoryId || 'all'}
							onChange={(value) => handleFilterChange('categoryId', value === 'all' ? '' : value)}
							placeholder="全部分类"
						>
							<Option value="all">全部分类</Option>
							{categories.map((cat) => (
								<Option key={cat.id} value={cat.id.toString()}>{cat.name}</Option>
							))}
						</Select>
					</div>

					<div>
						<label htmlFor="collectionId" className="block text-sm font-medium text-foreground mb-1">
							合集
						</label>
						<Select
							value={filters.collectionId || 'all'}
							onChange={(value) => handleFilterChange('collectionId', value === 'all' ? '' : value)}
							placeholder="全部合集"
						>
							<Option value="all">全部合集</Option>
							{collections.map((col) => (
								<Option key={col.id} value={col.id.toString()}>{col.name}</Option>
							))}
						</Select>
					</div>

					<div>
						<label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">
							搜索
						</label>
						<div className="flex gap-2">
							<Input
								id="search"
								placeholder="群名关键词"
								value={filters.search}
								onChange={(e) => handleFilterChange('search', e.target.value)}
							/>
							<Button type="primary" htmlType="submit" icon={<Search className="h-4 w-4" />} />
						</div>
					</div>
				</form>
			</Card>

			{!showAddForm && (
				<div className="mb-6">
					<Button onClick={() => setShowAddForm(true)}>添加群名</Button>
				</div>
			)}

			{showAddForm && (
				<Card className="mb-6">
					<h2 className="text-lg font-semibold text-foreground mb-4">添加新群名</h2>

					{addError && (
						<div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm text-destructive mb-4">
							{addError}
						</div>
					)}

					<form onSubmit={handleAddSubmit} className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div>
								<label htmlFor="addName" className="block text-sm font-medium text-foreground mb-1">
									群名 <span className="text-destructive">*</span>
								</label>
								<Input
									id="addName"
									name="name"
									value={addForm.name}
									onChange={handleAddFormChange}
									placeholder="请输入群名"
									required
								/>
							</div>
							<div>
								<label htmlFor="addCategoryId" className="block text-sm font-medium text-foreground mb-1">
									分类
								</label>
								<Select
									value={addForm.categoryId || 'none'}
									onChange={(value) => setAddForm({ ...addForm, categoryId: value === 'none' ? '' : value })}
									placeholder="无分类"
								>
									<Option value="none">无分类</Option>
									{categories.map((cat) => (
										<Option key={cat.id} value={cat.id.toString()}>{cat.name}</Option>
									))}
								</Select>
							</div>
							<div>
								<label htmlFor="addCollectionId" className="block text-sm font-medium text-foreground mb-1">
									合集
								</label>
								<Select
									value={addForm.collectionId || 'none'}
									onChange={(value) => setAddForm({ ...addForm, collectionId: value === 'none' ? '' : value })}
									placeholder="无合集"
								>
									<Option value="none">无合集</Option>
									{collections.map((col) => (
										<Option key={col.id} value={col.id.toString()}>{col.name}</Option>
									))}
								</Select>
							</div>
						</div>
						<div className="flex gap-2">
							<Button
								onClick={handleCancelAdd}
							>
								取消
							</Button>
							<Button
								type="primary"
								className="bg-orange-500 hover:bg-orange-600"
								disabled={addSubmitting}
								htmlType="submit"
							>
								{addSubmitting ? '添加中...' : '添加'}
							</Button>
						</div>
					</form>
				</Card>
			)}

			{loading ? (
				<div className="text-center py-12 text-muted-foreground">加载中...</div>
			) : groupNames.length === 0 ? (
				<Card className="p-12 text-center">
					<div className="text-6xl mb-4">📭</div>
					<h3 className="text-lg font-semibold text-foreground mb-2">
						没有找到群名
					</h3>
					<p className="text-muted-foreground">
						请尝试调整筛选条件
					</p>
				</Card>
			) : (
				<>
					<div className="bg-card border border-border rounded-lg overflow-hidden hidden sm:block">
						<table className="min-w-full divide-y divide-border">
							<thead>
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
										ID
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
										群名
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
										分类
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
										合集
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
										状态
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
										浏览/点赞/复制
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-48">
										操作
									</th>
								</tr>
							</thead>
							<tbody className="bg-card divide-y divide-border">
								{groupNames.map((item) => (
									<tr key={item.id} className="hover:bg-accent">
										<td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
											{item.id}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
											{editingId === item.id ? (
												<Input
													name="name"
													value={editForm.name}
													onChange={handleEditFormChange}
													className="w-full px-2 py-1 border border-input rounded text-sm"
													required
												/>
											) : (
												item.name
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
											{editingId === item.id ? (
												<Select
													value={editForm.categoryId || 'none'} onChange={(value) => setEditForm({ ...editForm, categoryId: value === 'none' ? '' : value })}
													placeholder="无分类"
												>
													<Option value="none">无分类</Option>
													{categories.map((cat) => (
														<Option key={cat.id} value={cat.id.toString()}>{cat.name}</Option>
													))}
												</Select>
											) : (
												item.category ? `${item.category.icon || ''} ${item.category.name}` : '-'
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
											{editingId === item.id ? (
												<Select
													value={editForm.collectionId || 'none'} onChange={(value) => setEditForm({ ...editForm, collectionId: value === 'none' ? '' : value })}
													placeholder="无合集"
												>
													<Option value="none">无合集</Option>
													{collections.map((col) => (
														<Option key={col.id} value={col.id.toString()}>{col.name}</Option>
													))}
												</Select>
											) : (
												item.collection?.name || '-'
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{editingId === item.id ? (
												<Select
													value={editForm.status}
													onChange={(value: 'pending' | 'approved' | 'rejected') => setEditForm({ ...editForm, status: value })}
												>
													<Option value="pending">待审核</Option>
													<Option value="approved">已通过</Option>
													<Option value="rejected">已拒绝</Option>
												</Select>
											) : (
												<Badge
													status={
														item.status === 'approved' ? 'success' :
														item.status === 'rejected' ? 'error' :
														'default'
													}
													text={
														item.status === 'approved' ? '已通过' :
														item.status === 'rejected' ? '已拒绝' : '待审核'
													}
												/>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-right">
											{item.views}/{item.likes}/{item.copies}
										</td>
										<td className="px-6 py-4 text-right text-sm font-medium w-48">
											<div className="flex justify-end">
												{editingId === item.id ? (
													<div className="flex flex-col gap-2">
														<Button
															size="small"
															onClick={handleCancelEdit}
														>
															取消
														</Button>
														<Button
															size="small"
															onClick={(e) => handleUpdate(e, item.id)}
															disabled={submitting}
															className="bg-orange-500 text-white hover:bg-orange-600"
															type="primary"
														>
															{submitting ? '保存中...' : '保存'}
														</Button>
														<DeleteButton
															action={`/api/admin/group-names/${item.id}`}
															onSuccess={loadData}
														>
															删除
														</DeleteButton>
													</div>
												) : (
													<Button
														size="small"
														onClick={() => handleEdit(item)}
														icon={<Pencil className="h-4 w-4" />}
													>
														编辑
													</Button>
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
							<div key={item.id} className="bg-card border border-border rounded-lg p-4">
								{editingId === item.id ? (
									<form onSubmit={(e) => handleUpdate(e, item.id)} className="space-y-3">
										{editError && (
											<div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm text-destructive">
												{editError}
											</div>
										)}
										<div className="text-xs text-muted-foreground">ID: {item.id}</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-1">群名</label>
											<Input
												name="name"
												value={editForm.name}
												onChange={handleEditFormChange}
												required
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-1">分类</label>
											<Select value={editForm.categoryId || 'none'} onChange={(value) => setEditForm({ ...editForm, categoryId: value === 'none' ? '' : value })} placeholder="无分类">
												<Option value="none">无分类</Option>
												{categories.map((cat) => (
													<Option key={cat.id} value={cat.id.toString()}>{cat.name}</Option>
												))}
											</Select>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-1">合集</label>
											<Select value={editForm.collectionId || 'none'} onChange={(value) => setEditForm({ ...editForm, collectionId: value === 'none' ? '' : value })} placeholder="无合集">
												<Option value="none">无合集</Option>
												{collections.map((col) => (
													<Option key={col.id} value={col.id.toString()}>{col.name}</Option>
												))}
											</Select>
										</div>
										<div>
											<label className="block text-sm font-medium text-foreground mb-1">状态</label>
											<Select
												value={editForm.status}
												onChange={(value: 'pending' | 'approved' | 'rejected') => setEditForm({ ...editForm, status: value })}
											>
												<Option value="pending">待审核</Option>
												<Option value="approved">已通过</Option>
												<Option value="rejected">已拒绝</Option>
											</Select>
										</div>
										<div className="flex gap-2">
											<Button
												onClick={handleCancelEdit}
												className="flex-1"
											>
												取消
											</Button>
											<Button
												type="primary"
												className="flex-1 bg-orange-500 hover:bg-orange-600"
												disabled={submitting}
												htmlType="submit"
											>
												{submitting ? '保存中...' : '保存'}
											</Button>
										</div>
										<DeleteButton
											action={`/api/admin/group-names/${item.id}`}
											className="w-full"
											onSuccess={loadData}
										>
											删除
										</DeleteButton>
									</form>
								) : (
									<>
										<div className="flex justify-between items-start mb-3">
											<div>
												<div className="text-xs text-muted-foreground mb-1">ID: {item.id}</div>
												<h3 className="text-base font-semibold text-foreground">{item.name}</h3>
											</div>
											<Badge
												status={
													item.status === 'approved' ? 'success' :
													item.status === 'rejected' ? 'error' :
													'default'
												}
												text={
													item.status === 'approved' ? '已通过' :
													item.status === 'rejected' ? '已拒绝' : '待审核'
												}
											/>
										</div>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-muted-foreground">分类:</span>
												<span className="text-foreground">{item.category ? `${item.category.icon || ''} ${item.category.name}` : '-'}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">合集:</span>
												<span className="text-foreground">{item.collection?.name || '-'}</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">浏览/点赞/复制:</span>
												<span className="text-foreground">{item.views}/{item.likes}/{item.copies}</span>
											</div>
										</div>
										<div className="mt-4 pt-4 border-t border-border">
											<Button
												onClick={() => handleEdit(item)}
												className="w-full"
												icon={<Pencil className="h-5 w-5" />}
											>
												编辑
											</Button>
										</div>
									</>
								)}
							</div>
						))}
					</div>

					{total > pageSize && (
						<div className="flex justify-center items-center gap-2 mt-6">
							<Button
								onClick={() => setPage(page - 1)}
								disabled={page <= 1}
							>
								上一页
							</Button>
							<span className="px-4 py-2 text-muted-foreground">
								第 {page} 页 / 共 {totalPages} 页
							</span>
							<Button
								onClick={() => setPage(page + 1)}
								disabled={page >= totalPages}
							>
								下一页
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
