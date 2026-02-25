'use client';

import { useState } from 'react';
import { Button } from 'antd';
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
		<>
			<div className="overflow-x-auto hidden sm:block">
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

			<div className="sm:hidden space-y-4">
				{groupNames.map((item) => (
					<div key={item.id} className="bg-gray-50 rounded-lg p-4">
						<h3 className="text-base font-semibold text-gray-900 mb-2">{item.name}</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">分类:</span>
								<span className="text-gray-900">
									{item.category ? (
										<div className="flex items-center gap-1">
											{item.category.icon && (
												<span className="text-sm">{item.category.icon}</span>
											)}
											{item.category.name}
										</div>
									) : (
										'未分类'
									)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">提交时间:</span>
								<span className="text-gray-900">{new Date(item.createdAt).toLocaleString('zh-CN')}</span>
							</div>
						</div>
						<div className="mt-4 pt-4 border-t border-border">
							<ReviewActions id={item.id} />
						</div>
					</div>
				))}
			</div>
		</>
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
		<div className="flex justify-end gap-2 w-full sm:w-auto">
			<Button
				type="default"
				size="small"
				onClick={() => handleReview('rejected')}
				disabled={isReviewing}
				className="text-red-600 border-red-300 flex-1 sm:flex-none"
			>
				拒绝
			</Button>
			<Button
				type="default"
				size="small"
				onClick={() => handleReview('approved')}
				disabled={isReviewing}
				className="text-green-600 border-green-300 flex-1 sm:flex-none"
			>
				通过
			</Button>
		</div>
	);
}
