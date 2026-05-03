#!/bin/sh
set -e

# Run database migrations
npx drizzle-kit migrate

# Seed if users table is empty (first boot)
node -e "
const Database = require('better-sqlite3');
const db = new Database('./data/kitchenflow.db');
try {
  const count = db.prepare('SELECT COUNT(*) as c FROM users').get();
  if (count.c === 0) {
    console.log('First boot — running seed...');
    require('child_process').execSync('npx tsx src/db/seed.ts', { stdio: 'inherit' });
  } else {
    console.log('Database already seeded, skipping.');
  }
} catch(e) {
  console.log('Tables not ready yet, running seed after migration...');
  require('child_process').execSync('npx tsx src/db/seed.ts', { stdio: 'inherit' });
}
db.close();
"

# Start the app
exec node server.js
