'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PendingGroupName {
	id: number;
	name: string;
	category: {
		id: number;
		name: string;
		icon?: string;
	} | null;
	createdAt: Date;
	userId: string | null;
}

interface PendingGroupNamesTableProps {
	groupNames: PendingGroupName[];
}

export function PendingGroupNamesTable({ groupNames }: PendingGroupNamesTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200">
				<thead>
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							群名
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							分类
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							提交时间
						</th>
						<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							操作
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{groupNames.map((item) => (
						<tr key={item.id} className="hover:bg-gray-50">
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="text-sm font-medium text-gray-900">
									{item.name}
								</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								{item.category ? (
									<div className="flex items-center gap-2">
										{item.category.icon && (
											<span className="text-lg">{item.category.icon}</span>
										)}
										<div className="text-sm text-gray-900">
											{item.category.name}
										</div>
									</div>
								) : (
									<span className="text-sm text-gray-500">未分类</span>
								)}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{new Date(item.createdAt).toLocaleString('zh-CN')}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<ReviewActions id={item.id} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function ReviewActions({ id }: { id: number }) {
	const [isReviewing, setIsReviewing] = useState(false);
	const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

	const handleReview = async (reviewStatus: 'approved' | 'rejected') => {
		setIsReviewing(true);
		try {
			const response = await fetch(`/api/admin/group-names/${id}/review`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: reviewStatus }),
			});

			if (response.ok) {
				setStatus(reviewStatus);
			}
		} catch (error) {
			console.error('Review failed:', error);
		} finally {
			setIsReviewing(false);
		}
	};

	if (status !== 'pending') {
		return (
			<span className={cn(
				'px-2 py-1 text-xs rounded-full',
				status === 'approved' && 'bg-green-100 text-green-800',
				status === 'rejected' && 'bg-red-100 text-red-800'
			)}>
				{status === 'approved' ? '已通过' : '已拒绝'}
			</span>
		);
	}

	return (
		<div className="flex justify-end gap-2">
			<Button
				variant="outline"
				size="sm"
				onClick={() => handleReview('rejected')}
				disabled={isReviewing}
				className="text-red-600 hover:text-red-700 hover:border-red-300"
			>
				拒绝
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() => handleReview('approved')}
				disabled={isReviewing}
				className="text-green-600 hover:text-green-700 hover:border-green-300"
			>
				通过
			</Button>
		</div>
	);
}