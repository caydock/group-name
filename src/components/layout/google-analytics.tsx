'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export function GoogleAnalytics() {
	const pathname = usePathname();
	const isAdmin = pathname?.startsWith('/admin');

	// 不在后台页面加载 GA
	if (isAdmin) {
		return null;
	}

	return (
		<>
			<Script
				src="https://www.googletagmanager.com/gtag/js?id=G-FYF716NX4N"
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'G-FYF716NX4N');
				`}
			</Script>
		</>
	);
}
