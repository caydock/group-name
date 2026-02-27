'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
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

	const handleCategorySelect = (id: number) => {
		console.log('Category selected:', id);
		setCategoryId(id);
	};

	const handleSubmit = async () => {
		if (!name.trim() || categoryId === null) {
			toast.error('请填写完整信息');
			return;
		}

		setIsSubmitting(true);

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

			toast.success('提交成功！等待管理员审核后即可显示');
			setName('');
			setCategoryId(null);
		} catch (error) {
			console.error('Error submitting group name:', error);
			toast.error('提交失败，请稍后重试');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
					群名 <span className="text-red-500">*</span>
				</label>
				<Input
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="请输入有趣好玩的群聊名称"
					maxLength={50}
					disabled={isSubmitting}
				/>
				<p className="text-xs text-gray-500 mt-1">{name.length}/50</p>
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

			<Button
				onClick={handleSubmit}
				className="w-full"
				disabled={!name.trim() || categoryId === null || isSubmitting}
			>
				{isSubmitting ? '提交中...' : '提交群名'}
			</Button>
		</div>
	);
}
