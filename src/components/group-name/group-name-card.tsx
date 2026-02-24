'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GroupNameCardProps {
	id: number;
	name: string;
	views: number;
	likes: number;
	copies: number;
	className?: string;
}

export function GroupNameCard({
	id,
	name,
	views,
	likes,
	copies,
	className,
}: GroupNameCardProps) {
	const [copied, setCopied] = useState(false);
	const [liked, setLiked] = useState(false);
	const [localLikes, setLocalLikes] = useState(likes);

	const handleCopy = async (e: React.MouseEvent) => {
		e.stopPropagation();
		// 检查 navigator.clipboard 是否可用
		if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
			try {
				await navigator.clipboard.writeText(name);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);

				// 异步更新数据库，不影响用户体验
				fetch('/api/copy', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id }),
				}).catch((err) => {
					console.warn('Failed to record copy count:', err);
				});
			} catch (error) {
				console.error('Failed to copy:', error);
			}
		} else {
			// 使用降级方案：execCommand
			try {
				const textArea = document.createElement('textarea');
				textArea.value = name;
				textArea.style.position = 'fixed';
				textArea.style.left = '-999999px';
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} catch (fallbackError) {
				console.error('Fallback copy also failed:', fallbackError);
			}
		}
	};

	const handleLike = async () => {
		if (liked) return;
		setLiked(true);
		setLocalLikes(prev => prev + 1);

		// 异步更新数据库，不影响用户体验
		fetch('/api/like', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id }),
		}).catch((err) => {
			console.warn('Failed to record like count:', err);
		});
	};

	return (
		<div
			onClick={handleCopy}
			className={cn(
				'border border-gray-200 rounded-lg p-3',
				'hover:shadow-md transition-shadow duration-200 cursor-pointer',
				'bg-white',
				className
			)}
		>
			<div className="flex items-center justify-between gap-2">
				<h3 className="text-base font-semibold text-gray-900 line-clamp-2 flex-1">
					{name}
				</h3>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={(e) => {
							e.stopPropagation();
							handleLike();
						}}
						className={cn(
							'text-gray-600 hover:text-red-500 px-1.5 py-1 h-7',
							liked && 'text-red-500'
						)}
					>
						<Heart className={cn('h-3.5 w-3.5', liked && 'fill-current')} />
						<span className="ml-0.5 text-xs">{localLikes}</span>
					</Button>
				</div>
			</div>
			{copied && (
				<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
					已复制到剪贴板
				</div>
			)}
		</div>
	);
}