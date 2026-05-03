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

export const recipes = sqliteTable('recipes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nameEn: text('name_en').notNull(),
  nameHi: text('name_hi'),
  photoUrl: text('photo_url'),
  categories: text('categories', { mode: 'json' }).$type<string[]>().default([]),
  baseServings: integer('base_servings').notNull().default(1),
  prepTimeMinutes: integer('prep_time_minutes'),
  cookTimeMinutes: integer('cook_time_minutes'),
  ingredients: text('ingredients', { mode: 'json' }).$type<Ingredient[]>().default([]),
  steps: text('steps', { mode: 'json' }).$type<Step[]>().default([]),
  createdBy: integer('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const clients = sqliteTable('clients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  contactPerson: text('contact_person'),
  contactPhone: text('contact_phone'),
  headcount: integer('headcount').notNull(),
  meals: text('meals', { mode: 'json' }).$type<string[]>().notNull(),
  deliveryAddress: text('delivery_address'),
  deliveryTimes: text('delivery_times', { mode: 'json' }).$type<Record<string, string>>().default({}),
  preferences: text('preferences'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const dailyMenus = sqliteTable('daily_menus', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  clientId: integer('client_id').notNull(),
  mealType: text('meal_type', { enum: ['breakfast', 'lunch', 'dinner'] }).notNull(),
  dishes: text('dishes', { mode: 'json' }).$type<MenuDish[]>().default([]),
  status: text('status', { enum: ['draft', 'published'] }).notNull().default('draft'),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdBy: integer('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const shiftTasks = sqliteTable('shift_tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  recipeId: integer('recipe_id').notNull(),
  shiftType: text('shift_type', { enum: ['shift_4am', 'shift_6am', 'shift_6pm'] }).notNull(),
  totalServings: integer('total_servings').notNull(),
  status: text('status', { enum: ['not_started', 'prepping', 'cooking', 'done'] }).notNull().default('not_started'),
  clientNames: text('client_names', { mode: 'json' }).$type<string[]>().default([]),
  prepStartedAt: integer('prep_started_at', { mode: 'timestamp' }),
  cookStartedAt: integer('cook_started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  expectedStartBy: integer('expected_start_by', { mode: 'timestamp' }),
  expectedDoneBy: integer('expected_done_by', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export type Ingredient = {
  nameEn: string;
  nameHi?: string;
  quantity: number;
  unit: string;
};

export type Step = {
  order: number;
  descriptionEn: string;
  descriptionHi?: string;
};

export type MenuDish = {
  recipeId: number;
  servings: number;
};
