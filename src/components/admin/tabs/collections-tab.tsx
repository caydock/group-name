'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DeleteButton } from '@/components/admin/delete-button';
import { Pencil } from 'lucide-react';

interface Collection {
	id: number;
	name: string;
	description: string | null;
	coverImage: string | null;
	groupNamesCount: number;
	sortOrder: number;
}

export function CollectionsTab() {
	const [collections, setCollections] = useState<Collection[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [addFormData, setAddFormData] = useState({
		name: '',
		description: '',
		coverImage: '',
		sortOrder: '0',
	});
	const [editFormData, setEditFormData] = useState({
		name: '',
		description: '',
		coverImage: '',
		sortOrder: '0',
	});
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		loadCollections();
	}, []);

	const loadCollections = async () => {
		setLoading(true);
		try {
			const res = await fetch('/api/admin/collections');
			if (res.ok) {
				const data = await res.json() as Collection[];
				setCollections(data.sort((a, b) => a.sortOrder - b.sortOrder));
			}
		} catch (error) {
			console.error('加载合集失败:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSubmitting(true);

		try {
			const res = await fetch('/api/admin/collections', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(addFormData),
			});

			if (!res.ok) {
				const data = await res.json() as { error?: string };
				throw new Error(data.error || '添加失败');
			}

			setAddFormData({ name: '', description: '', coverImage: '', sortOrder: '0' });
			loadCollections();
		} catch (err) {
			setError(err instanceof Error ? err.message : '添加失败，请重试');
		} finally {
			setSubmitting(false);
		}
	};

	const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		setAddFormData({
			...addFormData,
			[name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
		});
	};

	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		setEditFormData({
			...editFormData,
			[name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
		});
	};

	const handleEdit = (collection: Collection) => {
		setEditingId(collection.id);
		setEditFormData({
			name: collection.name,
			description: collection.description || '',
			coverImage: collection.coverImage || '',
			sortOrder: collection.sortOrder.toString(),
		});
	};

	const handleUpdate = async (e: React.FormEvent, id: number) => {
		e.preventDefault();
		setError('');
		setSubmitting(true);

		try {
			const res = await fetch(`/api/admin/collections/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editFormData),
			});

			if (!res.ok) {
				const data = await res.json() as { error?: string };
				throw new Error(data.error || '更新失败');
			}

			setEditingId(null);
			loadCollections();
		} catch (err) {
			setError(err instanceof Error ? err.message : '更新失败，请重试');
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setError('');
	};

	if (loading) {
		return <div className="text-gray-600">加载中...</div>;
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900 hidden sm:block">合集管理</h1>
				<span className="text-sm text-gray-600">
					共 {collections.length} 个合集
				</span>
			</div>

			<form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">添加新合集</h2>

				{error && (
					<div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600 mb-4">
						{error}
					</div>
				)}

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
							合集名称 <span className="text-red-500">*</span>
						</label>
						<Input
							id="name"
							name="name"
							value={addFormData.name}
							onChange={handleAddChange}
							required
						/>
					</div>

					<div>
						<label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
							描述
						</label>
						<Input
							id="description"
							name="description"
							value={addFormData.description}
							onChange={handleAddChange}
						/>
					</div>

					<div>
						<label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
							封面图片URL
						</label>
						<Input
							id="coverImage"
							name="coverImage"
							value={addFormData.coverImage}
							onChange={handleAddChange}
						/>
					</div>

					<div>
						<label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
							排序
						</label>
						<Input
							id="sortOrder"
							name="sortOrder"
							type="number"
							value={addFormData.sortOrder}
							onChange={handleAddChange}
						/>
					</div>

					<div className="flex items-end">
						<Button
							onClick={handleSubmit}
							disabled={submitting}
						>
							{submitting ? '添加中...' : '添加合集'}
						</Button>
					</div>
				</div>
			</form>

			<div className="bg-white border border-gray-200 rounded-lg overflow-hidden hidden sm:block">
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
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								排序
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
								操作
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{collections.map((collection) => (
							<tr key={collection.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{editingId === collection.id ? (
										<Input
											name="name"
											value={editFormData.name}
											onChange={handleEditChange}
											className="h-8"
											required
										/>
									) : (
										collection.name
									)}
								</td>
								<td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
									{editingId === collection.id ? (
										<Input
											name="description"
											value={editFormData.description}
											onChange={handleEditChange}
											className="h-8"
										/>
									) : (
										collection.description || '-'
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{collection.groupNamesCount}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
									{editingId === collection.id ? (
										<Input
											name="sortOrder"
											type="number"
											value={editFormData.sortOrder}
											onChange={handleEditChange}
											className="w-20 text-right h-8"
										/>
									) : (
										collection.sortOrder
									)}
								</td>
								<td className="px-6 py-4 text-right text-sm font-medium w-48">
									<div className="flex justify-end">
										{editingId === collection.id ? (
											<div className="flex gap-2">
												<Button
													size="sm"
													variant="outline"
													onClick={handleCancelEdit}
												>
													取消
												</Button>
												<Button
													size="sm"
													onClick={(e) => handleUpdate(e, collection.id)}
													disabled={submitting}
												>
													保存
												</Button>
											</div>
										) : (
											<Button
												size="sm"
												variant="outline"
												onClick={() => handleEdit(collection)}
											>
												<Pencil className="h-4 w-4 mr-2" />
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
				{collections.map((collection) => (
					<div key={collection.id} className="bg-white border border-gray-200 rounded-lg p-4">
						{editingId === collection.id ? (
							<form onSubmit={(e) => handleUpdate(e, collection.id)} className="space-y-3">
								{error && (
									<div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600">
										{error}
									</div>
								)}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">合集名称</label>
									<Input
										name="name"
										value={editFormData.name}
										onChange={handleEditChange}
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
									<Input
										name="description"
										value={editFormData.description}
										onChange={handleEditChange}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">封面图片URL</label>
									<Input
										name="coverImage"
										value={editFormData.coverImage}
										onChange={handleEditChange}
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
									<Input
										name="sortOrder"
										type="number"
										value={editFormData.sortOrder}
										onChange={handleEditChange}
									/>
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										onClick={handleCancelEdit}
										className="flex-1"
									>
										取消
									</Button>
									<Button
										className="flex-1"
										disabled={submitting}
										type="submit"
									>
										{submitting ? '保存中...' : '保存'}
									</Button>
								</div>
								<DeleteButton
									action={`/api/admin/collections/${collection.id}`}
									className="w-full"
									onSuccess={loadCollections}
								>
									删除
								</DeleteButton>
							</form>
						) : (
							<>
								<h3 className="text-base font-semibold text-gray-900 mb-2">{collection.name}</h3>
								{collection.description && (
									<p className="text-sm text-gray-600 mb-3">{collection.description}</p>
								)}
								<div className="flex flex-wrap gap-2 mb-3">
									<span className="text-sm text-gray-600">群名数: {collection.groupNamesCount}</span>
								</div>
								<div className="flex justify-between items-center pt-3 border-t border-gray-100">
									<span className="text-sm text-gray-600">排序: {collection.sortOrder}</span>
									<Button
										variant="outline"
										onClick={() => handleEdit(collection)}
									>
										<Pencil className="h-4 w-4 mr-2" />
										编辑
									</Button>
								</div>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
