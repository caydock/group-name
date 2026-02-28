'use client';

import { useEffect, useRef, useState } from 'react';

export function GoogleAd() {
	const adRef = useRef<HTMLModElement>(null);
	const [adLoaded, setAdLoaded] = useState(false);
	const [adVisible, setAdVisible] = useState(true);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);

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

		const checkAdLoad = () => {
			if (adRef.current) {
				setTimeout(() => {
					const currentRef = adRef.current;
					if (currentRef) {
						const isFilled = currentRef.innerHTML.trim().length > 0;
						setAdLoaded(true);

						if (!isFilled) {
							setAdVisible(false);
						}
					}
				}, 3000);
			}
		};

		checkAdLoad();
	}, []);

	const adHeight = '90px';

	if (!adVisible) {
		return null;
	}

	return (
		<div className="flex justify-center w-full pt-4">
			<ins
				ref={adRef}
				className="adsbygoogle bg-gray-100"
				style={{
					display: 'block',
					width: '100%',
					maxWidth: '1200px',
					height: adHeight,
					minHeight: adHeight,
					visibility: isMounted && adLoaded ? 'visible' : 'hidden',
				}}
				data-ad-client="ca-pub-2011896129037768"
				data-ad-format="auto"
				data-full-width-responsive="true"
				data-ad-slot="5715402930"
			/>
		</div>
	);
}
