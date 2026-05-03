import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email'),
  passwordHash: text('password_hash'),
  pin: text('pin'),
  role: text('role', { enum: ['owner', 'head_chef', 'supervisor', 'worker'] }).notNull(),
  assignedShift: text('assigned_shift', { enum: ['shift_4am', 'shift_6am', 'shift_6pm'] }),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
