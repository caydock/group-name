import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: "2mb",
		},
	},
	turbopack: {},
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals.push({
				"better-sqlite3": "commonjs better-sqlite3",
			});
		}
		return config;
	},
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
