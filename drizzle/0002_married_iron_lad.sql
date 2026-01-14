CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text NOT NULL,
	`body` text NOT NULL,
	`featured_image` text NOT NULL,
	`category` text NOT NULL,
	`tags` text,
	`author` text NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`is_published` integer DEFAULT false,
	`published_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `destination_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`destination_id` integer NOT NULL,
	`image_url` text NOT NULL,
	`caption` text,
	`order_index` integer DEFAULT 0,
	`created_at` text NOT NULL,
	FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`city_name` text NOT NULL,
	`slug` text NOT NULL,
	`region` text NOT NULL,
	`overview` text NOT NULL,
	`travel_tips` text,
	`top_venues` text,
	`hero_image` text NOT NULL,
	`map_area` text,
	`is_published` integer DEFAULT true,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `destinations_slug_unique` ON `destinations` (`slug`);--> statement-breakpoint
CREATE TABLE `experience_faqs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`experience_id` integer NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`order_index` integer DEFAULT 0,
	`created_at` text NOT NULL,
	FOREIGN KEY (`experience_id`) REFERENCES `experiences`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `experience_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`experience_id` integer NOT NULL,
	`image_url` text NOT NULL,
	`order_index` integer DEFAULT 0,
	`created_at` text NOT NULL,
	FOREIGN KEY (`experience_id`) REFERENCES `experiences`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`duration` text NOT NULL,
	`group_size_min` integer NOT NULL,
	`group_size_max` integer NOT NULL,
	`price_from` real NOT NULL,
	`description` text NOT NULL,
	`included` text,
	`what_to_provide` text,
	`hero_image` text NOT NULL,
	`category` text,
	`is_published` integer DEFAULT true,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `experiences_slug_unique` ON `experiences` (`slug`);--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` text NOT NULL,
	`order_index` integer DEFAULT 0,
	`is_published` integer DEFAULT true,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`region` text,
	`website` text,
	`contact_email` text,
	`commission_notes` text,
	`is_active` integer DEFAULT true,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`location` text NOT NULL,
	`region` text NOT NULL,
	`sleeps_min` integer NOT NULL,
	`sleeps_max` integer NOT NULL,
	`bedrooms` integer NOT NULL,
	`bathrooms` integer NOT NULL,
	`price_from_midweek` real NOT NULL,
	`price_from_weekend` real NOT NULL,
	`description` text NOT NULL,
	`house_rules` text,
	`check_in_out` text,
	`ical_url` text,
	`hero_image` text NOT NULL,
	`hero_video` text,
	`floorplan_url` text,
	`map_lat` real,
	`map_lng` real,
	`owner_contact` text,
	`featured` integer DEFAULT false,
	`is_published` integer DEFAULT true,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `properties_slug_unique` ON `properties` (`slug`);--> statement-breakpoint
CREATE TABLE `property_features` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`feature_name` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `property_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`image_url` text NOT NULL,
	`caption` text,
	`order_index` integer DEFAULT 0,
	`created_at` text NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`guest_name` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text NOT NULL,
	`property_id` integer,
	`review_date` text NOT NULL,
	`guest_image` text,
	`is_approved` integer DEFAULT false,
	`is_published` integer DEFAULT false,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
