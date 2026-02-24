import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
	title: string;
	value: number;
	icon: string;
	className?: string;
}

export function StatCard({ title, value, icon, className }: StatCardProps) {
	return (
		<Card className={className}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<span className="text-2xl">{icon}</span>
			</CardHeader>
			<CardContent>
				<div className="text-3xl font-bold">{value}</div>
			</CardContent>
		</Card>
	);
}