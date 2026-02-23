import { getDB } from '@/lib/db';
import { getDashboardStats, getPendingGroupNames } from '@/lib/db/queries';
import { StatCard } from '@/components/admin/stat-card';
import { PendingGroupNamesTable } from '@/components/admin/pending-group-names-table';
import Link from 'next/link';

export default async function AdminDashboardPage() {
	const db = getDB();
	const [stats, pendingResult] = await Promise.all([
		getDashboardStats(db),
		getPendingGroupNames(db, 1, 10),
	]);

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
						<Link
							href="/admin/group-names"
							className="inline-flex items-center mt-4 text-sm text-gray-600 hover:text-gray-900"
						>
							查看全部 {pendingResult.total} 条待审核 →
						</Link>
					)}
				</div>
			)}
		</div>
	);
}