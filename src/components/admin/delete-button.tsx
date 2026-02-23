'use client';

import { useState } from 'react';

interface DeleteButtonProps {
	action: string;
	children: React.ReactNode;
	className?: string;
	onSuccess?: () => void;
}

export function DeleteButton({ action, children, className, onSuccess }: DeleteButtonProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleClick = async (e: React.FormEvent) => {
		if (!confirm('确认删除？')) {
			return;
		}
		setIsSubmitting(true);

		try {
			const res = await fetch(action, {
				method: 'DELETE',
			});

			if (res.ok) {
				onSuccess?.();
			} else {
				const data = await res.json() as { error?: string };
				alert(data.error || '删除失败');
			}
		} catch (error) {
			alert('删除失败，请重试');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<button
			onClick={handleClick}
			className={className}
			disabled={isSubmitting}
		>
			{isSubmitting ? '删除中...' : children}
		</button>
	);
}