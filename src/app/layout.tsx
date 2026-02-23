import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap",
	preload: true,
});

export const metadata: Metadata = {
	title: {
		default: "群名大全 - 有趣的微信群名",
		template: "%s | 群名大全"
	},
	description: "发现有趣的微信群名，支持复制和分类浏览，创建您的群名合集。搞笑、文艺、商务、家庭、校园、游戏等各种分类等你来探索。",
	keywords: ["微信群名", "群名大全", "搞笑群名", "群名生成", "群名推荐", "微信聊天群", "群聊名称"],
	authors: [{ name: "群名大全" }],
	creator: "群名大全",
	openGraph: {
		type: "website",
		locale: "zh_CN",
		url: "https://group-name.com",
		title: "群名大全 - 有趣的微信群名",
		description: "发现有趣的微信群名，支持复制和分类浏览",
		siteName: "群名大全",
	},
	twitter: {
		card: "summary",
		title: "群名大全 - 有趣的微信群名",
		description: "发现有趣的微信群名，支持复制和分类浏览",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh-CN">
			<body
				className={`${geistSans.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
