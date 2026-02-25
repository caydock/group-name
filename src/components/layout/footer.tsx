import Link from 'next/link';

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-border mt-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-gray-600 text-sm">
						© {currentYear} 群名小岛. 保留所有权利.
					</p>
					<div className="flex items-center gap-6 text-sm text-gray-600">
						<Link href="/terms" className="hover:text-gray-900">
							服务条款
						</Link>
						<Link href="/privacy" className="hover:text-gray-900">
							隐私政策
						</Link>
						<Link href="/disclaimer" className="hover:text-gray-900">
							免责声明
						</Link>
						<Link href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
							站点地图
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
