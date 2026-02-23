'use client';

import { useState, useEffect } from 'react';
import { DeleteButton } from '@/components/admin/delete-button';

interface Category {
	id: number;
	name: string;
	icon: string | null;
	description: string | null;
	sortOrder: number;
}

export function CategoriesTab() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [formData, setFormData] = useState({
		name: '',
		icon: '',
		description: '',
		sortOrder: '0',
	});
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		setLoading(true);
		try {
			const res = await fetch('/api/admin/categories');
			if (res.ok) {
				const data = await res.json() as Category[];
				setCategories(data);
			}
		} catch (error) {
			console.error('加载分类失败:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSubmitting(true);

		try {
			const res = await fetch('/api/admin/categories', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				const data = await res.json() as { error?: string };
				throw new Error(data.error || '添加失败');
			}

			setFormData({ name: '', icon: '', description: '', sortOrder: '0' });
			loadCategories();
		} catch (err) {
			setError(err instanceof Error ? err.message : '添加失败，请重试');
		} finally {
			setSubmitting(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	if (loading) {
		return <div className="text-gray-600">加载中...</div>;
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
				<span className="text-sm text-gray-600">
					共 {categories.length} 个分类
				</span>
			</div>

			<form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">添加新分类</h2>

				{error && (
					<div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600 mb-4">
						{error}
					</div>
				)}

				<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
							分类名称 <span className="text-red-500">*</span>
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
						<label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
							图标（Emoji）
						</label>
						<input
							id="icon"
							name="icon"
							type="text"
							value={formData.icon}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="😀"
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
				</div>

				<div className="mt-4">
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
						disabled={submitting}
					>
						{submitting ? '添加中...' : '添加分类'}
					</button>
				</div>
			</form>

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
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								操作
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
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<DeleteButton
										action={`/api/admin/categories/${category.id}`}
										className="text-red-600 hover:text-red-900"
										onSuccess={loadCategories}
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