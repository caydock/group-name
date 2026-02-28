'use client';

import { useEffect, useRef, useState } from 'react';

export function GoogleAd() {
	const adRef = useRef<HTMLModElement>(null);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setIsMobile(window.innerWidth < 768);

		if (adRef.current && !adRef.current.hasAttribute('data-ad-initialized')) {
			adRef.current.setAttribute('data-ad-initialized', 'true');

			const scriptId = 'google-adsense-script';
			if (!document.getElementById(scriptId)) {
				const script = document.createElement('script');
				script.id = scriptId;
				script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2011896129037768';
				script.async = true;
				script.crossOrigin = 'anonymous';
				document.head.appendChild(script);
			}

			try {
				((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
			} catch (e) {
				console.error('Ad error:', e);
			}
		}
	}, []);

	return (
		<div className="flex justify-center">
			<ins
				ref={adRef}
				className="adsbygoogle bg-gray-100"
				style={{
					display: 'inline-block',
					width: isMobile ? '300px' : '1200px',
					height: isMobile ? '50px' : '90px',
				}}
				data-ad-client="ca-pub-2011896129037768"
				data-ad-slot={isMobile ? '8464166843' : '5715402930'}
			/>
		</div>
	);
}
