'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GroupNameCardProps {
	id: number;
	name: string;
	category?: {
		id: number;
		name: string;
		icon?: string;
	};
	views: number;
	likes: number;
	copies: number;
	className?: string;
}

export function GroupNameCard({
	id,
	name,
	category,
	views,
	likes,
	copies,
	className,
}: GroupNameCardProps) {
	const [copied, setCopied] = useState(false);
	const [liked, setLiked] = useState(false);
	const [localLikes, setLocalLikes] = useState(likes);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(name);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			await fetch('/api/copy', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id }),
			});
		} catch (error) {
			console.error('Failed to copy:', error);
		}
	};

	const handleLike = async () => {
		if (liked) return;
		setLiked(true);
		setLocalLikes(prev => prev + 1);
		try {
			await fetch('/api/like', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id }),
			});
		} catch (error) {
			console.error('Failed to like:', error);
		}
	};

	return (
		<div
			className={cn(
				'border border-gray-200 rounded-lg p-3',
				'hover:shadow-md transition-shadow duration-200',
				'bg-white',
				className
			)}
		>
			<div className="flex items-center justify-between gap-2">
				<h3 className="text-base font-semibold text-gray-900 line-clamp-2 flex-1">
					{name}
				</h3>
				<div className="flex items-center gap-2">
					{category && (
						<span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
							{category.icon}
							{category.name}
						</span>
					)}
					<Button
						variant="ghost"
						size="sm"
						onClick={handleLike}
						className={cn(
							'text-gray-600 hover:text-red-500 px-1.5 py-1 h-7',
							liked && 'text-red-500'
						)}
					>
						<Heart className={cn('h-3.5 w-3.5', liked && 'fill-current')} />
						<span className="ml-0.5 text-xs">{localLikes}</span>
					</Button>
					<Button
						variant={copied ? 'default' : 'outline'}
						size="sm"
						onClick={handleCopy}
						className="text-gray-600 px-1.5 py-1 h-7 text-xs"
					>
						<Copy className="h-3.5 w-3.5" />
					</Button>
				</div>
			</div>
		</div>
	);
}