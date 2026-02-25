import { Card } from 'antd';

interface StatCardProps {
	title: string;
	value: number;
	icon: string;
	className?: string;
}

export function StatCard({ title, value, icon, className }: StatCardProps) {
	return (
		<Card className={className}>
			<Card.Meta 
				title={<span className="text-sm font-medium text-muted-foreground">{title}</span>}
				description={
					<div className="flex items-center justify-between">
						<div className="text-3xl font-bold">{value}</div>
						<span className="text-2xl">{icon}</span>
					</div>
				}
			/>
		</Card>
	);
}
