import { Breadcrumb } from '@/components/layout/breadcrumb';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '免责声明',
	description: '群名小岛免责声明',
};

export default function DisclaimerPage() {
	return (
		<div className="min-h-screen bg-white">
			<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<Breadcrumb items={[{ label: '免责声明' }]} />
				<h1 className="text-3xl font-bold text-gray-900 mb-8">免责声明</h1>
				<div className="prose prose-gray">
					<p className="text-gray-600">使用本网站前，请仔细阅读以下免责声明。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">1. 内容准确性</h2>
					<p className="text-gray-600">本网站上的群名内容由用户提交，我们尽力审核但无法保证所有内容的准确性和完整性。用户应自行判断和使用。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">2. 版权问题</h2>
					<p className="text-gray-600">用户提交的内容应确保不侵犯他人知识产权。如发现侵权内容，请及时联系我们，我们将尽快处理。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">3. 使用风险</h2>
					<p className="text-gray-600">使用本网站所产生的任何风险由用户自行承担。我们不对因使用本网站而导致的任何损失负责。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">4. 第三方链接</h2>
					<p className="text-gray-600">本网站可能包含第三方网站的链接，我们对这些外部网站的内容和服务不承担责任。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">5. 服务中断</h2>
					<p className="text-gray-600">由于技术原因或其他不可抗力，本网站可能出现服务中断，对此我们不承担任何责任。</p>
					<h2 className="text-xl font-semibold mt-6 mb-3">6. 法律适用</h2>
					<p className="text-gray-600">本免责声明适用中华人民共和国法律。如发生争议，双方应友好协商解决。</p>
					<p className="text-gray-600 mt-8">最后更新：2025年</p>
				</div>
			</main>
		</div>
	);
}
