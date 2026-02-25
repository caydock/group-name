'use client';

import { useState } from 'react';
import { Button, Modal, message } from 'antd';
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
				message.success('删除成功');
				onSuccess?.();
			} else {
				const data = await res.json() as { error?: string };
				message.error(data.error || '删除失败');
			}
		} catch (error) {
			message.error('删除失败，请重试');
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
				danger
			>
				{children}
			</Button>
			<Modal
				open={isModalOpen}
				onOk={handleDelete}
				onCancel={() => setIsModalOpen(false)}
				okText="确认删除"
				cancelText="取消"
				confirmLoading={isSubmitting}
				okButtonProps={{ danger: true }}
				title={
					<div className="flex items-center gap-3">
						<AlertTriangle className="h-5 w-5 text-red-500" />
						确认删除
					</div>
				}
			>
				<p>此操作无法撤销，确定要继续吗？</p>
			</Modal>
		</>
	);
}
