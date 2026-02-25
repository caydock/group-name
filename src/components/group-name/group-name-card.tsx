'use client';

import { useState } from 'react';
import { Button, message } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
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
	const [messageApi, contextHolder] = message.useMessage();

	const handleCopy = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
			try {
				await navigator.clipboard.writeText(name);
				setCopied(true);
				messageApi.success('已复制到剪贴板');
				setTimeout(() => setCopied(false), 2000);
			} catch (error) {
				console.error('Failed to copy:', error);
			}
		} else {
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
				messageApi.success('已复制到剪贴板');
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
		<>
			{contextHolder}
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
					<Button
						type="text"
						size="small"
						icon={liked ? <HeartFilled style={{ color: '#ef4444' }} /> : <HeartOutlined />}
						onClick={(e) => {
							e.stopPropagation();
							handleLike();
						}}
					>
						{localLikes}
					</Button>
				</div>
			</div>
		</>
	);
}
