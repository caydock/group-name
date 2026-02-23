import { cn } from '@/lib/utils';

interface StatCardProps {
	title: string;
	value: number;
	icon: string;
	className?: string;
}

export function StatCard({ title, value, icon, className }: StatCardProps) {
	return (
		<div className={cn(
			'bg-white border border-gray-200 rounded-lg p-6',
			className
		)}>
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-gray-600 mb-1">{title}</p>
					<p className="text-3xl font-bold text-gray-900">{value}</p>
				</div>
				<span className="text-4xl">{icon}</span>
			</div>
		</div>
	);
}