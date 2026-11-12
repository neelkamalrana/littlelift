CREATE TABLE `bills` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`cents` integer NOT NULL,
	`story` text NOT NULL,
	`paypal` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
