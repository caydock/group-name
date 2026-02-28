import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { ConditionalHeader } from "@/components/layout/conditional-header";
import { Footer } from "@/components/layout/footer";
import { GoogleAd } from "@/components/layout/google-ad";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@/components/layout/google-analytics";
import { JsonLd } from "@/components/layout/json-ld";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://qm.caydock.com"),
	title: {
		default: "群名岛 - 发现有趣好玩的群聊名称大全",
		template: "%s | 群名岛"
	},
	description: "群名岛提供海量群聊名称大全，包括搞笑群名、文艺群名、商务群名、家庭群名、校园群名、游戏群名等各种分类。支持按分类浏览、查看最新和热门群名、一键复制使用，帮您轻松找到心仪的群聊名称。",
	keywords: [
		"群名",
		"群名岛",
		"群名大全",
		"搞笑群名",
		"文艺群名",
		"商务群名",
		"家庭群名",
		"校园群名",
		"游戏群名",
		"群名生成",
		"群名推荐",
		"群聊名称",
		"微信群名",
		"QQ群名",
		"三人群名",
		"四人群名",
		"五人群名",
		"六人群名",
		"群名创意",
		"好听的群名",
		"有特色的群名"
	],
	authors: [{ name: "群名岛" }],
	creator: "群名岛",
	icons: {
		icon: [
			{ url: '/images/favicon-16x16.jpg', sizes: '16x16', type: 'image/jpeg' },
			{ url: '/images/favicon-32x32.jpg', sizes: '32x32', type: 'image/jpeg' },
		],
		apple: [
			{ url: '/images/logo-128x128.jpg', sizes: '128x128', type: 'image/jpeg' },
		],
	},
	openGraph: {
		type: "website",
		locale: "zh_CN",
		url: "https://qm.caydock.com",
		title: "群名岛 - 发现有趣好玩的群聊名称大全",
		description: "群名岛提供海量群聊名称大全，包括搞笑、文艺、商务、家庭、校园、游戏等各种分类，支持一键复制和分类浏览",
		siteName: "群名岛",
		images: [
			{
				url: 'https://qm.caydock.com/images/logo-256x256.jpg',
				width: 256,
				height: 256,
				alt: '群名岛 Logo',
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "群名岛 - 发现有趣好玩的群聊名称大全",
		description: "群名岛提供海量群聊名称大全，包括搞笑、文艺、商务、家庭、校园、游戏等各种分类",
		images: ['https://qm.caydock.com/images/logo-256x256.jpg'],
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
	width: 'device-width',
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
				className={`${inter.variable} antialiased`}
			>
				<JsonLd />
				<GoogleAnalytics />
				<ConditionalHeader />
				{children}
				<Footer />
				<Toaster />
			</body>
		</html>
	);
}
