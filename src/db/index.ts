import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

type DbType = BetterSQLite3Database<typeof schema>;

let _db: DbType | null = null;
let _unavailable = false;

export function getDb(): DbType | null {
  if (_db) return _db;
  if (_unavailable) return null;
  try {
    const Database = require('better-sqlite3');
    const { drizzle } = require('drizzle-orm/better-sqlite3');
    const sqlite = new Database('./data/kitchenflow.db');
    sqlite.pragma('journal_mode = WAL');
    _db = drizzle(sqlite, { schema }) as DbType;
    return _db;
  } catch {
    _unavailable = true;
    return null;
  }
}

export function isDbAvailable(): boolean {
  if (process.env.FORCE_DEMO === '1') return false;
  if (_db) return true;
  if (_unavailable) return false;
  return getDb() !== null;
}

export const db = new Proxy({} as DbType, {
  get(_, prop) {
    const instance = getDb();
    if (!instance) throw new Error('Database not available');
    return (instance as any)[prop];
  },
});
