import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
	id: number;
	name: string;
	icon?: string;
	className?: string;
}

export function CategoryCard({ id, name, icon, className }: CategoryCardProps) {
	return (
		<Link
			href={`/categories/${id}`}
			className={cn(
				'flex items-center gap-3 p-4',
				'border border-gray-200 rounded-lg',
				'hover:bg-gray-50 hover:border-gray-300',
				'transition-all duration-200',
				'bg-white',
				className
			)}
		>
			{icon && <span className="text-2xl">{icon}</span>}
			<span className="font-medium text-gray-900">{name}</span>
		</Link>
	);
}