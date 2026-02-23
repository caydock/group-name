import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'default' | 'outline' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	asChild?: boolean;
	href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	function Button({ 
		className, 
		variant = 'default', 
		size = 'md', 
		children, 
		asChild = false,
		href,
		...props 
	}, ref) {
		const variants = {
			default: '!bg-black text-white hover:!bg-gray-800',
			outline: 'border border-gray-300 text-gray-900 hover:bg-gray-50',
			ghost: 'text-gray-900 hover:bg-gray-100',
		};

		const sizes = {
			sm: 'px-3 py-1.5 text-sm',
			md: 'px-4 py-2',
			lg: 'px-6 py-3 text-lg',
		};

		const buttonClassName = cn(
			'rounded-md font-medium transition-colors duration-200 inline-flex items-center justify-center',
			variants[variant],
			sizes[size],
			props.disabled && 'opacity-50 cursor-not-allowed',
			className
		);

		if (asChild && href) {
			return (
				<Link 
					href={href} 
					className={buttonClassName}
					{...props as any}
				>
					{children}
				</Link>
			);
		}

		if (href) {
			return (
				<a
					href={href}
					className={buttonClassName}
					{...props as any}
				>
					{children}
				</a>
			);
		}

		return (
			<button
				className={buttonClassName}
				ref={ref}
				{...props}
			>
				{children}
			</button>
		);
	}
);