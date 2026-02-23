import { eq, desc, and, sql, like } from 'drizzle-orm';
import { DB } from './index';
import { groupNames, categories, collections, users } from './schema';

export async function getLatestGroupNames(db: DB, limit: number = 12) {
  return (await db
    .select({
      id: groupNames.id,
      name: groupNames.name,
      views: groupNames.views,
      likes: groupNames.likes,
      copies: groupNames.copies,
      category: {
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
      },
    })
    .from(groupNames)
    .leftJoin(categories, eq(groupNames.categoryId, categories.id))
    .where(eq(groupNames.status, 'approved'))
    .orderBy(desc(groupNames.createdAt))
    .limit(limit)) as any[];
}

export async function getLatestGroupNamesPaginated(
  db: DB,
  page: number = 1,
  pageSize: number = 20
) {
  const offset = (page - 1) * pageSize;
  
  const [data, total] = await Promise.all([
    db
      .select({
        id: groupNames.id,
        name: groupNames.name,
        views: groupNames.views,
        likes: groupNames.likes,
        copies: groupNames.copies,
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
        },
      })
      .from(groupNames)
      .leftJoin(categories, eq(groupNames.categoryId, categories.id))
      .where(eq(groupNames.status, 'approved'))
      .orderBy(desc(groupNames.createdAt))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(groupNames)
      .where(eq(groupNames.status, 'approved'))
      .then((result: any) => result[0]?.count ?? 0),
  ]);
  
  return { data, total, page, pageSize, length: data.length };
}

export async function getPopularGroupNames(db: DB, limit: number = 12) {
  return (await db
    .select({
      id: groupNames.id,
      name: groupNames.name,
      views: groupNames.views,
      likes: groupNames.likes,
      copies: groupNames.copies,
      category: {
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
      },
    })
    .from(groupNames)
    .leftJoin(categories, eq(groupNames.categoryId, categories.id))
    .where(eq(groupNames.status, 'approved'))
    .orderBy(desc(groupNames.views))
    .limit(limit)) as any[];
}

export async function getPopularGroupNamesPaginated(
  db: DB,
  page: number = 1,
  pageSize: number = 20
) {
  const offset = (page - 1) * pageSize;
  
  const [data, total] = await Promise.all([
    db
      .select({
        id: groupNames.id,
        name: groupNames.name,
        views: groupNames.views,
        likes: groupNames.likes,
        copies: groupNames.copies,
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
        },
      })
      .from(groupNames)
      .leftJoin(categories, eq(groupNames.categoryId, categories.id))
      .where(eq(groupNames.status, 'approved'))
      .orderBy(desc(groupNames.views))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(groupNames)
      .where(eq(groupNames.status, 'approved'))
      .then((result: any) => result[0]?.count ?? 0),
  ]);
  
  return { data, total, page, pageSize, length: data.length };
}

export async function getGroupNamesByCategory(
  db: DB,
  categoryId: number,
  page: number = 1,
  pageSize: number = 20
) {
  const offset = (page - 1) * pageSize;
  
  const [data, total] = await Promise.all([
    db
      .select({
        id: groupNames.id,
        name: groupNames.name,
        views: groupNames.views,
        likes: groupNames.likes,
        copies: groupNames.copies,
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
        },
      })
      .from(groupNames)
      .leftJoin(categories, eq(groupNames.categoryId, categories.id))
      .where(and(eq(groupNames.status, 'approved'), eq(groupNames.categoryId, categoryId)))
      .orderBy(desc(groupNames.createdAt))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(groupNames)
      .where(and(eq(groupNames.status, 'approved'), eq(groupNames.categoryId, categoryId)))
      .then((result: any) => result[0]?.count ?? 0),
  ]);
  
  return { data, total, page, pageSize };
}

export async function searchGroupNames(db: DB, query: string, limit: number = 20) {
  return await db
    .select({
      id: groupNames.id,
      name: groupNames.name,
      views: groupNames.views,
      likes: groupNames.likes,
      copies: groupNames.copies,
      category: {
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
      },
    })
    .from(groupNames)
    .leftJoin(categories, eq(groupNames.categoryId, categories.id))
    .where(and(
      eq(groupNames.status, 'approved'),
      like(groupNames.name, `%${query}%`)
    ))
    .orderBy(desc(groupNames.views))
    .limit(limit);
}

export async function getAllCategories(db: DB) {
  return (await db
    .select()
    .from(categories)
    .orderBy(categories.sortOrder, categories.name)) as any[];
}

export async function getFeaturedCollections(db: DB, limit: number = 6) {
  return (await db
    .select({
      id: collections.id,
      name: collections.name,
      description: collections.description,
      coverImage: collections.coverImage,
      groupNamesCount: sql<number>`count(${groupNames.id})`,
    })
    .from(collections)
    .leftJoin(groupNames, and(
      eq(collections.id, groupNames.collectionId),
      eq(groupNames.status, 'approved')
    ))
    .where(eq(collections.isFeatured, true))
    .groupBy(collections.id)
    .orderBy(collections.sortOrder)
    .limit(limit)) as any[];
}

export async function createGroupName(db: DB, data: {
  name: string;
  categoryId?: number | null;
  userId?: string;
  collectionId?: number;
}) {
  const result = await db
    .insert(groupNames)
    .values({
      name: data.name,
      categoryId: data.categoryId || null,
      userId: data.userId,
      collectionId: data.collectionId,
    })
    .returning({ id: groupNames.id });
  
  return result[0];
}

export async function incrementCopyCount(db: DB, id: number) {
  await db
    .update(groupNames)
    .set({ 
      copies: sql<number>`copies + 1`,
      views: sql<number>`views + 1`,
    })
    .where(eq(groupNames.id, id));
}

export async function incrementLikeCount(db: DB, id: number) {
  await db
    .update(groupNames)
    .set({ 
      likes: sql<number>`likes + 1`,
    })
    .where(eq(groupNames.id, id));
}

export async function getPendingGroupNames(db: DB, page: number = 1, pageSize: number = 20) {
  const offset = (page - 1) * pageSize;
  
  const [data, total] = await Promise.all([
    db
      .select({
        id: groupNames.id,
        name: groupNames.name,
        category: categories,
        createdAt: groupNames.createdAt,
        userId: groupNames.userId,
      })
      .from(groupNames)
      .leftJoin(categories, eq(groupNames.categoryId, categories.id))
      .where(eq(groupNames.status, 'pending'))
      .orderBy(desc(groupNames.createdAt))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(groupNames)
      .where(eq(groupNames.status, 'pending'))
      .then((result: any) => result[0]?.count ?? 0),
  ]);
  
  return { data, total, page, pageSize };
}

export async function reviewGroupName(db: DB, id: number, status: 'approved' | 'rejected') {
  await db
    .update(groupNames)
    .set({ 
      status,
      updatedAt: new Date(),
    })
    .where(eq(groupNames.id, id));
}

export async function getDashboardStats(db: DB) {
  const [totalNames, pendingNames, approvedNames, todayNames] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(groupNames),
    db.select({ count: sql<number>`count(*)` }).from(groupNames).where(eq(groupNames.status, 'pending')),
    db.select({ count: sql<number>`count(*)` }).from(groupNames).where(eq(groupNames.status, 'approved')),
    db.select({ count: sql<number>`count(*)` }).from(groupNames)
      .where(sql<string>`date(created_at) = date('now')`),
  ]);
  
  return {
    totalNames: totalNames[0]?.count ?? 0,
    pendingNames: pendingNames[0]?.count ?? 0,
    approvedNames: approvedNames[0]?.count ?? 0,
    todayNames: todayNames[0]?.count ?? 0,
  };
}

export async function getCategoryById(db: DB, id: number) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  
  return result[0];
}

export async function getCollectionById(db: DB, id: number) {
  const result = await db
    .select()
    .from(collections)
    .where(eq(collections.id, id))
    .limit(1);
  
  return result[0];
}

export async function getGroupNamesByCollection(
  db: DB,
  collectionId: number,
  page: number = 1,
  pageSize: number = 20
) {
  const offset = (page - 1) * pageSize;
  
  const [data, total] = await Promise.all([
    db
      .select({
        id: groupNames.id,
        name: groupNames.name,
        views: groupNames.views,
        likes: groupNames.likes,
        copies: groupNames.copies,
        category: {
          id: categories.id,
          name: categories.name,
          icon: categories.icon,
        },
      })
      .from(groupNames)
      .leftJoin(categories, eq(groupNames.categoryId, categories.id))
      .where(and(eq(groupNames.status, 'approved'), eq(groupNames.collectionId, collectionId)))
      .orderBy(desc(groupNames.createdAt))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(groupNames)
      .where(and(eq(groupNames.status, 'approved'), eq(groupNames.collectionId, collectionId)))
      .then((result: any) => result[0]?.count ?? 0),
  ]);
  
  return { data, total, page, pageSize };
}

export async function getAllCollections(db: DB) {
  const result = await db
    .select({
      id: collections.id,
      name: collections.name,
      description: collections.description,
      coverImage: collections.coverImage,
      isFeatured: collections.isFeatured,
      groupNamesCount: sql<number>`count(${groupNames.id})`,
      sortOrder: collections.sortOrder,
    })
    .from(collections)
    .leftJoin(groupNames, and(
      eq(collections.id, groupNames.collectionId),
      eq(groupNames.status, 'approved')
    ))
    .groupBy(collections.id)
    .orderBy(collections.sortOrder);

  return result;
}

export async function createCollection(db: DB, data: {
  name: string;
  description?: string;
  coverImage?: string;
  isFeatured?: boolean;
}) {
  const result = await db
    .insert(collections)
    .values(data)
    .returning({ id: collections.id });
  
  return result[0];
}

export async function updateCollection(db: DB, id: number, data: {
  name?: string;
  description?: string;
  coverImage?: string;
  isFeatured?: boolean;
}) {
  await db
    .update(collections)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(collections.id, id));
}

export async function deleteCollection(db: DB, id: number) {
  await db
    .delete(collections)
    .where(eq(collections.id, id));
}