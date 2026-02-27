import { MetadataRoute } from 'next';
import { getDB } from '@/lib/db';
import { groupNames, categories, collections } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const db = getDB();
	
	const [allCategories, allCollections] = await Promise.all([
		db.select().from(categories),
		db.select().from(collections),
	]);

	const baseUrl = 'https://qm.caydock.com';

	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: `${baseUrl}/latest`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9,
		},
		{
			url: `${baseUrl}/popular`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9,
		},
		{
			url: `${baseUrl}/categories`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/collections`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/submit`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.5,
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		{
			url: `${baseUrl}/disclaimer`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.3,
		},
	];

	const categoryPages: MetadataRoute.Sitemap = allCategories.map((category) => ({
		url: `${baseUrl}/categories/${category.id}`,
		lastModified: category.createdAt,
		changeFrequency: 'weekly' as const,
		priority: 0.6,
	}));

	const collectionPages: MetadataRoute.Sitemap = allCollections.map((collection) => ({
		url: `${baseUrl}/collections/${collection.id}`,
		lastModified: collection.updatedAt,
		changeFrequency: 'weekly' as const,
		priority: 0.6,
	}));

	return [...staticPages, ...categoryPages, ...collectionPages];
}