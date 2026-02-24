import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '服务条款',
	description: '群名小岛服务条款',
};

export default function TermsPage() {
	return (
		<div className="min-h-screen bg-white">
			<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">服务条款</h1>
				<div className="prose prose-gray">
					<p className="text-gray-600">欢迎使用群名小岛。使用本网站即表示您同意以下服务条款。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">1. 服务内容</h2>
					<p className="text-gray-600">群名小岛提供群名展示、浏览、复制等服务，用户可以在平台上发现和分享有趣的群名。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">2. 用户行为</h2>
					<p className="text-gray-600">用户应遵守法律法规，不得发布违法、侵权、淫秽、暴力等内容。用户对自己的行为负责。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">3. 知识产权</h2>
					<p className="text-gray-600">本网站的内容受知识产权法保护，未经授权不得复制、传播或用于商业用途。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">4. 免责声明</h2>
					<p className="text-gray-600">本网站不对内容的准确性、完整性承担责任，使用本网站所产生的任何风险由用户自行承担。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">5. 条款修改</h2>
					<p className="text-gray-600">我们有权随时修改本服务条款，修改后的条款一经公布即生效。</p>
					<p className="text-gray-600 mt-8">最后更新：2025年</p>
				</div>
			</main>
		</div>
	);
}
