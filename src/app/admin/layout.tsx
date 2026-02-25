import type { Metadata, Viewport } from 'next';
import { Inter } from "next/font/google";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: '管理后台',
	description: '群名小岛管理后台，审核用户提交的群名，管理分类和合集',
	robots: {
		index: false,
		follow: false,
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="zh-CN">
			<body
				className={`${inter.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
