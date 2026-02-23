'use client';

import { useState, useEffect } from 'react';
import { StatCard } from '@/components/admin/stat-card';
import { PendingGroupNamesTable } from '@/components/admin/pending-group-names-table';

interface DashboardStats {
	totalNames: number;
	pendingNames: number;
	approvedNames: number;
	todayNames: number;
}

interface PendingResult {
	data: any[];
	total: number;
	pageSize: number;
}

export function DashboardTab() {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [pendingResult, setPendingResult] = useState<PendingResult | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			const [statsRes, pendingRes] = await Promise.all([
				fetch('/api/admin/stats'),
				fetch('/api/admin/pending-group-names?page=1&limit=10'),
			]);

			if (statsRes.ok && pendingRes.ok) {
				const [statsData, pendingData] = await Promise.all([
					statsRes.json() as Promise<DashboardStats>,
					pendingRes.json() as Promise<PendingResult>,
				]);
				setStats(statsData);
				setPendingResult(pendingData);
			}
		} catch (error) {
			console.error('加载数据失败:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div className="text-gray-600">加载中...</div>;
	}

	if (!stats || !pendingResult) {
		return <div className="text-gray-600">加载失败</div>;
	}

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-900 mb-6">数据统计</h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<StatCard
					title="总群名数"
					value={stats.totalNames}
					icon="📝"
				/>
				<StatCard
					title="待审核"
					value={stats.pendingNames}
					icon="⏳"
					className="bg-yellow-50 border-yellow-200"
				/>
				<StatCard
					title="已通过"
					value={stats.approvedNames}
					icon="✅"
					className="bg-green-50 border-green-200"
				/>
				<StatCard
					title="今日新增"
					value={stats.todayNames}
					icon="📅"
				/>
			</div>

			{pendingResult.data.length > 0 && (
				<div className="bg-white border border-gray-200 rounded-lg p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						待审核群名
					</h2>
					<PendingGroupNamesTable groupNames={pendingResult.data} />
					{pendingResult.total > pendingResult.pageSize && (
						<button
							onClick={() => window.dispatchEvent(new CustomEvent('switchTab', { detail: 'group-names' }))}
							className="inline-flex items-center mt-4 text-sm text-blue-600 hover:text-blue-800"
						>
							查看全部 {pendingResult.total} 条待审核 →
						</button>
					)}
				</div>
			)}
		</div>
	);
}