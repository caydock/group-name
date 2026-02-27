'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { AlertTriangle } from 'lucide-react';

interface DeleteButtonProps {
	action: string;
	children: React.ReactNode;
	className?: string;
	onSuccess?: () => void;
}

export function DeleteButton({ action, children, className, onSuccess }: DeleteButtonProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleDelete = async () => {
		setIsSubmitting(true);

		try {
			const res = await fetch(action, {
				method: 'DELETE',
			});

			if (res.ok) {
				setIsModalOpen(false);
				toast.success('删除成功');
				onSuccess?.();
			} else {
				const data = await res.json() as { error?: string };
				toast.error(data.error || '删除失败');
			}
		} catch (error) {
			toast.error('删除失败，请重试');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Button
				onClick={() => setIsModalOpen(true)}
				disabled={isSubmitting}
				className={className}
				variant="destructive"
			>
				{children}
			</Button>
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3">
							<AlertTriangle className="h-5 w-5 text-red-500" />
							确认删除
						</DialogTitle>
						<DialogDescription>
							此操作无法撤销，确定要继续吗？
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							onClick={() => setIsModalOpen(false)}
							variant="outline"
							disabled={isSubmitting}
						>
							取消
						</Button>
						<Button
							onClick={handleDelete}
							variant="destructive"
							disabled={isSubmitting}
						>
							{isSubmitting ? '删除中...' : '确认删除'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
