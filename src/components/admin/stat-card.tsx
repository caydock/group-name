import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
	title: string;
	value: number;
	icon: string;
	className?: string;
}

export function StatCard({ title, value, icon, className }: StatCardProps) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardDescription>{title}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<div className="text-3xl font-bold">{value}</div>
					<span className="text-2xl">{icon}</span>
				</div>
			</CardContent>
		</Card>
	);
}
