'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function SearchInput() {
	return (
		<div className="max-w-md mx-auto sm:hidden relative">
			<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 sm:hidden" />
			<Input
				type="search"
				placeholder="搜索群名..."
				className="pl-10 sm:hidden"
			/>
		</div>
	);
}
