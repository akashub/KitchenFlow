CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`password_hash` text,
	`pin` text,
	`role` text NOT NULL,
	`assigned_shift` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer
);
