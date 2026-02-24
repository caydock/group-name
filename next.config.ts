import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: "2mb",
		},
	},
	// 启用 Turbopack（Next.js 16 默认启用）
	turbopack: {},
	// 移除 webpack 配置，因为使用 Turbopack
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
