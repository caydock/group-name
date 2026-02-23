import type { Metadata } from 'next';
import { Geist } from "next/font/google";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap",
	preload: true,
});

export const metadata: Metadata = {
	title: '管理后台',
	description: '群名大全管理后台，审核用户提交的群名，管理分类和合集',
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
				className={`${geistSans.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
