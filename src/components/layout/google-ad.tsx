'use client';

import { useEffect, useRef, useState } from 'react';

interface GoogleAdProps {
	align?: 'center' | 'left';
}

export function GoogleAd({ align = 'center' }: GoogleAdProps) {
	const adRef = useRef<HTMLModElement>(null);
	const [isMobile, setIsMobile] = useState(false);
	const [adLoaded, setAdLoaded] = useState(false);
	const [adVisible, setAdVisible] = useState(true);

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

	const adHeight = isMobile ? '50px' : '90px';

	if (!adVisible) {
		return null;
	}

	return (
		<div className={`flex ${align === 'left' ? 'justify-start' : 'justify-center'}`}>
			<ins
				ref={adRef}
				className="adsbygoogle bg-gray-100"
				style={{
					display: 'inline-block',
					width: isMobile ? '300px' : '970px',
					height: adHeight,
					minHeight: adHeight,
					visibility: adLoaded ? 'visible' : 'hidden',
				}}
				data-ad-client="ca-pub-2011896129037768"
				data-ad-slot={isMobile ? '8464166843' : '5715402930'}
			/>
		</div>
	);
}
