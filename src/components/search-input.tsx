'use client';

import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export function SearchInput() {
	return (
		<div className="max-w-md mx-auto sm:hidden relative">
			<Input
				type="search"
				placeholder="搜索群名..."
				prefix={<SearchOutlined />}
				className="sm:hidden"
			/>
		</div>
	);
}
