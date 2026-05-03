CREATE TABLE `clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`contact_person` text,
	`contact_phone` text,
	`headcount` integer NOT NULL,
	`meals` text NOT NULL,
	`delivery_address` text,
	`delivery_times` text DEFAULT '{}',
	`preferences` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `daily_menus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`client_id` integer NOT NULL,
	`meal_type` text NOT NULL,
	`dishes` text DEFAULT '[]',
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`created_by` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name_en` text NOT NULL,
	`name_hi` text,
	`photo_url` text,
	`categories` text DEFAULT '[]',
	`base_servings` integer DEFAULT 1 NOT NULL,
	`prep_time_minutes` integer,
	`cook_time_minutes` integer,
	`ingredients` text DEFAULT '[]',
	`steps` text DEFAULT '[]',
	`created_by` integer,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `shift_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`recipe_id` integer NOT NULL,
	`shift_type` text NOT NULL,
	`total_servings` integer NOT NULL,
	`status` text DEFAULT 'not_started' NOT NULL,
	`client_names` text DEFAULT '[]',
	`prep_started_at` integer,
	`cook_started_at` integer,
	`completed_at` integer,
	`expected_start_by` integer,
	`expected_done_by` integer,
	`created_at` integer
);
