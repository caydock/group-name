import { getDB } from '@/lib/db';
import { getAllCategories } from '@/lib/db/queries';
import { CheckCircle } from 'lucide-react';
import { SubmitGroupNameForm } from '@/components/group-name/submit-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '提交群名 ',
	description: '分享您发现或创造的有趣群名，与大家分享您的创意，丰富群名小岛',
	keywords: '提交群名,群名投稿,分享群名,原创群名',
};

export default async function SubmitPage() {
	const db = getDB();
	const categories = await getAllCategories(db);

	return (
		<div className="min-h-screen bg-white">
			<main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
						<CheckCircle className="h-8 w-8 text-gray-600" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">提交群名</h1>
					<p className="text-gray-600">
						分享有趣的群名，让大家一起欣赏
					</p>
				</div>

				<div className="bg-white border border-gray-200 rounded-lg p-6">
					<SubmitGroupNameForm categories={categories as any} />
				</div>

				<div className="mt-8 text-center text-sm text-gray-600">
					<p>提交后需要经过管理员审核才能显示在网站上</p>
					<p className="mt-1">请遵守社区规范，不要提交不当内容</p>
				</div>
		</main>
		</div>
	);
}