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
import { AlertTriangle } from 'lucide-react';

interface DeleteButtonProps {
	action: string;
	children: React.ReactNode;
	className?: string;
	onSuccess?: () => void;
}

export function DeleteButton({ action, children, className, onSuccess }: DeleteButtonProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleDelete = async () => {
		setIsSubmitting(true);

		try {
			const res = await fetch(action, {
				method: 'DELETE',
			});

			if (res.ok) {
				setIsDialogOpen(false);
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
		<>
			<Button
				variant="destructive"
				onClick={() => setIsDialogOpen(true)}
				disabled={isSubmitting}
				className={className}
			>
				{children}
			</Button>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<div className="flex items-center gap-3 mb-2">
							<div className="bg-destructive/10 rounded-full p-2">
								<AlertTriangle className="h-5 w-5 text-destructive" />
							</div>
							<DialogTitle>确认删除</DialogTitle>
						</div>
						<DialogDescription>
							此操作无法撤销，确定要继续吗？
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsDialogOpen(false)}
							disabled={isSubmitting}
						>
							取消
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
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