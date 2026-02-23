import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CollectionCardProps {
	id: number;
	name: string;
	description?: string;
	coverImage?: string;
	groupNamesCount: number;
	className?: string;
}

export function CollectionCard({
	id,
	name,
	description,
	coverImage,
	groupNamesCount,
	className,
}: CollectionCardProps) {
	return (
		<Link
			href={`/collections/${id}`}
			className={cn(
				'block border border-gray-200 rounded-lg p-4',
				'hover:shadow-md transition-shadow duration-200',
				'bg-white',
				className
			)}
		>
			<div className="flex items-start justify-between mb-2">
				<h3 className="font-semibold text-gray-900 flex-1">{name}</h3>
			</div>
			{description && (
				<p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
			)}
			<span className="text-xs text-gray-500">{groupNamesCount} 个群名</span>
		</Link>
	);
}