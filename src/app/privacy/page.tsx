import { Breadcrumb } from '@/components/layout/breadcrumb';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '隐私政策',
	description: '群名小岛隐私政策',
};

export default function PrivacyPage() {
	return (
		<div className="min-h-screen bg-white">
			<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<Breadcrumb items={[{ label: '隐私政策' }]} />
				<h1 className="text-3xl font-bold text-gray-900 mb-8">隐私政策</h1>
				<div className="prose prose-gray">
					<p className="text-gray-600">我们非常重视您的隐私，本隐私政策说明了我们如何收集、使用和保护您的个人信息。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">1. 信息收集</h2>
					<p className="text-gray-600">我们可能收集您主动提供的信息，如提交的群名内容，以及自动收集的技术信息，如IP地址、浏览器类型等。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">2. 信息使用</h2>
					<p className="text-gray-600">收集的信息用于改进服务质量、提供个性化体验、保障网站安全等。我们不会将您的个人信息出售给第三方。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">3. 信息保护</h2>
					<p className="text-gray-600">我们采取合理的安全措施保护您的个人信息，防止未经授权的访问、使用或披露。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">4. Cookie使用</h2>
					<p className="text-gray-600">本网站可能使用Cookie来改善用户体验，您可以通过浏览器设置管理Cookie。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">5. 信息共享</h2>
					<p className="text-gray-600">除法律法规要求外，我们不会与第三方共享您的个人信息，除非获得您的明确同意。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">6. 政策更新</h2>
					<p className="text-gray-600">我们可能随时更新本隐私政策，更新后的政策将在网站上公布。</p>
					<p className="text-gray-600 mt-8">最后更新：2025年</p>
				</div>
			</main>
		</div>
	);
}
