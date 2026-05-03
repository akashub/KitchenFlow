import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { hashPassword } from '../lib/password';

async function seed() {
  const sqlite = new Database('./data/kitchenflow.db');
  const db = drizzle(sqlite, { schema });

  const passwordHash = await hashPassword('admin123');

  db.insert(schema.users).values({
    name: 'Kitchen Owner',
    email: 'owner@kitchenflow.local',
    passwordHash,
    role: 'owner',
  }).run();

  db.insert(schema.users).values({
    name: 'Head Chef',
    email: 'chef@kitchenflow.local',
    passwordHash: await hashPassword('chef123'),
    role: 'head_chef',
  }).run();

  db.insert(schema.users).values({
    name: 'Morning Supervisor',
    pin: '1234',
    role: 'supervisor',
    assignedShift: 'shift_4am',
  }).run();

  console.log('Seeded: owner, head chef, morning supervisor');
  sqlite.close();
}

seed();
