import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../src/lib/db/schema';
import fs from 'fs';
import path from 'path';

async function initDatabase() {
  const dbPath = './data/local.db';
  const dir = path.dirname(dbPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const sqlite = new Database(dbPath);
  const db = drizzle(sqlite, { schema });

  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });

  console.log('Local database initialized successfully!');
  process.exit(0);
}

initDatabase().catch((error) => {
  console.error('Error initializing database:', error);
  process.exit(1);
});