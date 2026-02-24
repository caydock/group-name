'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DeleteButton } from '@/components/admin/delete-button';
import { Pencil } from 'lucide-react';

interface Collection {
	id: number;
	name: string;
	description: string | null;
	coverImage: string | null;
	isFeatured: boolean;
	groupNamesCount: number;
	sortOrder: number;
}

export function CollectionsTab() {
	const [collections, setCollections] = useState<Collection[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		coverImage: '',
		isFeatured: false,
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
				setCollections(data);
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
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				const data = await res.json() as { error?: string };
				throw new Error(data.error || '添加失败');
			}

			setFormData({ name: '', description: '', coverImage: '', isFeatured: false, sortOrder: '0' });
			loadCollections();
		} catch (err) {
			setError(err instanceof Error ? err.message : '添加失败，请重试');
		} finally {
			setSubmitting(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
		});
	};

	const handleEdit = (collection: Collection) => {
		setEditingId(collection.id);
		setFormData({
			name: collection.name,
			description: collection.description || '',
			coverImage: collection.coverImage || '',
			isFeatured: collection.isFeatured,
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
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				const data = await res.json() as { error?: string };
				throw new Error(data.error || '更新失败');
			}

			setEditingId(null);
			setFormData({ name: '', description: '', coverImage: '', isFeatured: false, sortOrder: '0' });
			loadCollections();
		} catch (err) {
			setError(err instanceof Error ? err.message : '更新失败，请重试');
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setFormData({ name: '', description: '', coverImage: '', isFeatured: false, sortOrder: '0' });
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
						<input
							id="name"
							name="name"
							type="text"
							value={formData.name}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
							描述
						</label>
						<input
							id="description"
							name="description"
							type="text"
							value={formData.description}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
							封面图片URL
						</label>
						<input
							id="coverImage"
							name="coverImage"
							type="text"
							value={formData.coverImage}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="flex items-center gap-2">
						<input
							id="isFeatured"
							name="isFeatured"
							type="checkbox"
							checked={formData.isFeatured}
							onChange={handleChange}
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
							设为精选
						</label>
					</div>

					<div>
						<label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
							排序
						</label>
						<input
							id="sortOrder"
							name="sortOrder"
							type="number"
							value={formData.sortOrder}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="flex items-end">
						<Button
							type="submit"
							variant="outline"
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
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								精选
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
								<td className="px-6 py-4 text-right text-sm font-medium w-48">
									<div className="flex justify-end">
										{editingId === collection.id ? (
											<div className="flex flex-col gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={handleCancelEdit}
												>
													取消
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={(e) => handleUpdate(e, collection.id)}
													disabled={submitting}
													className="bg-orange-500 text-white hover:bg-orange-600"
												>
													{submitting ? '保存中...' : '保存'}
												</Button>
												<DeleteButton
													action={`/api/admin/collections/${collection.id}`}
													onSuccess={loadCollections}
												>
													删除
												</DeleteButton>
											</div>
										) : (
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleEdit(collection)}
											>
												<Pencil className="h-4 w-4" />
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
									<input
										name="name"
										type="text"
										value={formData.name}
										onChange={handleChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-md"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
									<input
										name="description"
										type="text"
										value={formData.description}
										onChange={handleChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-md"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">封面图片URL</label>
									<input
										name="coverImage"
										type="text"
										value={formData.coverImage}
										onChange={handleChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-md"
									/>
								</div>
								<div className="flex items-center gap-2">
									<input
										name="isFeatured"
										type="checkbox"
										checked={formData.isFeatured}
										onChange={handleChange}
										className="h-4 w-4"
									/>
									<label className="text-sm font-medium text-gray-700">设为精选</label>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
									<input
										name="sortOrder"
										type="number"
										value={formData.sortOrder}
										onChange={handleChange}
										className="w-full px-3 py-2 border border-gray-300 rounded-md"
									/>
								</div>
								<div className="flex gap-2">
									<Button
										type="button"
										variant="outline"
										onClick={handleCancelEdit}
										className="flex-1"
									>
										取消
									</Button>
									<Button
										type="submit"
										variant="outline"
										className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
										disabled={submitting}
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
									{collection.isFeatured ? (
										<span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
											精选
										</span>
									) : (
										<span className="text-gray-400">非精选</span>
									)}
								</div>
								<div className="flex justify-between items-center pt-3 border-t border-gray-100">
									<span className="text-sm text-gray-600">排序: {collection.sortOrder}</span>
									<Button
										variant="outline"
										onClick={() => handleEdit(collection)}
									>
										<Pencil className="h-4 w-4" />
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
