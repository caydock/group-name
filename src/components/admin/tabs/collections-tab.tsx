'use client';

import { useState, useEffect } from 'react';
import { DeleteButton } from '@/components/admin/delete-button';

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

	if (loading) {
		return <div className="text-gray-600">加载中...</div>;
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">合集管理</h1>
				<span className="text-sm text-gray-600">
					共 {collections.length} 个合集
				</span>
			</div>

			<form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">添加新合集</h2>

				{error && (
					<div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600 mb-4">
						{error}
					</div>
				)}

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
							disabled={submitting}
						>
							{submitting ? '添加中...' : '添加合集'}
						</button>
					</div>
				</div>
			</form>

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
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<DeleteButton
										action={`/api/admin/collections/${collection.id}`}
										className="text-red-600 hover:text-red-900"
										onSuccess={loadCollections}
									>
										删除
									</DeleteButton>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}