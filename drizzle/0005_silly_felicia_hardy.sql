ALTER TABLE `users` ADD `emailOptOut` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `unsubscribeToken` varchar(128);