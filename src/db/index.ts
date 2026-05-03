import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

let _db: BetterSQLite3Database<typeof schema> | null = null;

export function getDb() {
  if (!_db) {
    const sqlite = new Database('./data/kitchenflow.db');
    sqlite.pragma('journal_mode = WAL');
    _db = drizzle(sqlite, { schema });
  }
  return _db;
}

export const db = new Proxy({} as BetterSQLite3Database<typeof schema>, {
  get(_, prop) {
    return (getDb() as any)[prop];
  },
});
