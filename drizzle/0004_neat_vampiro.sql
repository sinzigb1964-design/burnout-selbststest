CREATE TABLE `magic_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(128) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`usedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `magic_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `magic_tokens_token_unique` UNIQUE(`token`)
);
