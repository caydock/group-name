'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SubmitGroupNameFormProps {
	categories: Array<{
		id: number;
		name: string;
		icon?: string;
	}>;
}

	export function SubmitGroupNameForm({ categories }: SubmitGroupNameFormProps) {
	const [name, setName] = useState('');
	const [categoryId, setCategoryId] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

	const handleCategorySelect = (id: number) => {
		console.log('Category selected:', id);
		setCategoryId(id);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim() || categoryId === null) {
			setSubmitStatus('error');
			return;
		}

		setIsSubmitting(true);
		setSubmitStatus('idle');

		try {
			const response = await fetch('/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: name.trim(),
					categoryId: categoryId === 0 ? null : categoryId,
				}),
			});

			if (!response.ok) {
				throw new Error('提交失败');
			}

			setSubmitStatus('success');
			setName('');
			setCategoryId(null);
		} catch (error) {
			console.error('Error submitting group name:', error);
			setSubmitStatus('error');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
					群名 <span className="text-red-500">*</span>
				</label>
				<Input
					id="name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="请输入有趣的群名"
					maxLength={50}
					required
					disabled={isSubmitting}
				/>
				<p className="mt-1 text-xs text-gray-500">
					{name.length}/50 字符
				</p>
			</div>

			<div>
				<label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
					分类 <span className="text-red-500">*</span>
				</label>
				<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
					{categories.map((category) => {
						const isSelected = categoryId === category.id;
						return (
						<div
							key={category.id}
							onClick={() => handleCategorySelect(category.id)}
							className={cn(
								'flex items-center gap-2 p-3 border rounded-lg transition-all cursor-pointer select-none',
								'hover:border-gray-400 hover:bg-gray-50',
								isSelected
									? 'border-black bg-gray-50'
									: 'border-gray-200',
								isSubmitting && 'opacity-50 pointer-events-none'
							)}
						>
							{category.icon && <span className="text-xl">{category.icon}</span>}
							<span className="text-sm font-medium">{category.name}</span>
						</div>
						);
					})}
					<div
						onClick={() => handleCategorySelect(0)}
						className={cn(
							'flex items-center gap-2 p-3 border rounded-lg transition-all cursor-pointer select-none',
							'hover:border-gray-400 hover:bg-gray-50',
							categoryId === 0
								? 'border-black bg-gray-50'
								: 'border-gray-200',
							isSubmitting && 'opacity-50 pointer-events-none'
						)}
					>
						<span className="text-xl">➕</span>
						<span className="text-sm font-medium">其他</span>
					</div>
				</div>
			</div>

			{submitStatus === 'success' && (
				<div className="bg-green-50 border border-green-200 rounded-md p-4">
					<p className="text-sm text-green-800">
						✓ 提交成功！等待管理员审核后即可显示
					</p>
				</div>
			)}

			{submitStatus === 'error' && (
				<div className="bg-red-50 border border-red-200 rounded-md p-4">
					<p className="text-sm text-red-800">
						✗ 提交失败，请稍后重试
					</p>
				</div>
			)}

			<Button
				type="submit"
				className="w-full"
				disabled={isSubmitting || !name.trim() || categoryId === null}
			>
				{isSubmitting ? '提交中...' : '提交群名'}
			</Button>
		</form>
	);
}