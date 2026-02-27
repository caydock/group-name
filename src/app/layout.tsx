import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { ConditionalHeader } from "@/components/layout/conditional-header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://qm.caydock.com"),
	title: {
		default: "群名岛 - 发现有趣好玩的群聊名称",
		template: "%s | 群名岛"
	},
	description: "发现发现有趣好玩的群聊名称，支持复制和分类浏览，创建您的群名合集。搞笑、文艺、商务、家庭、校园、游戏等各种分类等你来探索。",
	keywords: ["群名", "群名岛", "搞笑群名", "群名生成", "群名推荐", "群聊名称"],
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
		title: "群名岛 - 发现有趣好玩的群聊名称",
		description: "发现发现有趣好玩的群聊名称，支持复制和分类浏览",
		siteName: "群名岛",
		images: [
			{
				url: '/images/logo-256x256.jpg',
				width: 256,
				height: 256,
			},
		],
	},
	twitter: {
		card: "summary",
		title: "群名岛 - 发现有趣好玩的群聊名称",
		description: "发现发现有趣好玩的群聊名称，支持复制和分类浏览",
		images: ['/images/logo-256x256.jpg'],
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
				<ConditionalHeader />
				{children}
				<Footer />
				<Toaster />
			</body>
		</html>
	);
}
