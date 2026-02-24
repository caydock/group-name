import type { Metadata } from 'next';
import { Inter } from "next/font/google";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: '管理后台',
	description: '群名大全管理后台，审核用户提交的群名，管理分类和合集',
	viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
	robots: {
		index: false,
		follow: false,
	},
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
