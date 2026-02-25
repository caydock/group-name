import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    databaseId: 'cd587ce2-c6a1-4a5f-8a52-953e58fc2b2d',
    token: process.env.CLOUDFLARE_API_TOKEN || '',
  },
} satisfies Config;
