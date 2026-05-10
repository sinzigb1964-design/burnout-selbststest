import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const statusEnum = pgEnum("status", ["active", "completed", "abandoned"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  isCoach: boolean("isCoach").default(false).notNull(),
  consentGiven: boolean("consentGiven").default(false).notNull(),
  consentGivenAt: timestamp("consentGivenAt"),
  emailOptOut: boolean("emailOptOut").default(false).notNull(),
  unsubscribeToken: varchar("unsubscribeToken", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const testCycles = pgTable("test_cycles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  status: statusEnum("status").default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type TestCycle = typeof testCycles.$inferSelect;
export type InsertTestCycle = typeof testCycles.$inferInsert;

export const dailyEntries = pgTable("daily_entries", {
  id: serial("id").primaryKey(),
  cycleId: integer("cycleId").notNull(),
  userId: integer("userId").notNull(),
  dayNumber: integer("dayNumber").notNull(),
  entryDate: timestamp("entryDate").defaultNow().notNull(),
  b1q1: integer("b1q1").notNull().default(0),
  b1q2: integer("b1q2").notNull().default(0),
  b1q3: integer("b1q3").notNull().default(0),
  b1q4: integer("b1q4").notNull().default(0),
  b1q5: integer("b1q5").notNull().default(0),
  b1q6: integer("b1q6").notNull().default(0),
  b1q7: integer("b1q7").notNull().default(0),
  sumB1: integer("sumB1").notNull().default(0),
  b2q1: integer("b2q1").notNull().default(0),
  b2q2: integer("b2q2").notNull().default(0),
  b2q3: integer("b2q3").notNull().default(0),
  b2q4: integer("b2q4").notNull().default(0),
  b2q5: integer("b2q5").notNull().default(0),
  b2q6: integer("b2q6").notNull().default(0),
  b2q7: integer("b2q7").notNull().default(0),
  sumB2: integer("sumB2").notNull().default(0),
  b3q1: integer("b3q1").notNull().default(0),
  b3q2: integer("b3q2").notNull().default(0),
  b3q3: integer("b3q3").notNull().default(0),
  b3q4: integer("b3q4").notNull().default(0),
  b3q5: integer("b3q5").notNull().default(0),
  b3q6: integer("b3q6").notNull().default(0),
  b3q7: integer("b3q7").notNull().default(0),
  sumB3: integer("sumB3").notNull().default(0),
  b4q1: integer("b4q1").notNull().default(0),
  b4q2: integer("b4q2").notNull().default(0),
  b4q3: integer("b4q3").notNull().default(0),
  b4q4: integer("b4q4").notNull().default(0),
  b4q5: integer("b4q5").notNull().default(0),
  b4q6: integer("b4q6").notNull().default(0),
  b4q7: integer("b4q7").notNull().default(0),
  sumB4: integer("sumB4").notNull().default(0),
  b5q1: integer("b5q1").notNull().default(0),
  b5q2: integer("b5q2").notNull().default(0),
  b5q3: integer("b5q3").notNull().default(0),
  b5q4: integer("b5q4").notNull().default(0),
  b5q5: integer("b5q5").notNull().default(0),
  b5q6: integer("b5q6").notNull().default(0),
  b5q7: integer("b5q7").notNull().default(0),
  sumB5: integer("sumB5").notNull().default(0),
  b6q1: integer("b6q1").notNull().default(0),
  b6q2: integer("b6q2").notNull().default(0),
  b6q3: integer("b6q3").notNull().default(0),
  b6q4: integer("b6q4").notNull().default(0),
  b6q5: integer("b6q5").notNull().default(0),
  b6q6: integer("b6q6").notNull().default(0),
  b6q7: integer("b6q7").notNull().default(0),
  sumB6: integer("sumB6").notNull().default(0),
  b7q1: integer("b7q1").notNull().default(0),
  b7q2: integer("b7q2").notNull().default(0),
  b7q3: integer("b7q3").notNull().default(0),
  b7q4: integer("b7q4").notNull().default(0),
  b7q5: integer("b7q5").notNull().default(0),
  b7q6: integer("b7q6").notNull().default(0),
  b7q7: integer("b7q7").notNull().default(0),
  sumB7: integer("sumB7").notNull().default(0),
  b8q1: integer("b8q1").notNull().default(0),
  b8q2: integer("b8q2").notNull().default(0),
  b8q3: integer("b8q3").notNull().default(0),
  b8q4: integer("b8q4").notNull().default(0),
  b8q5: integer("b8q5").notNull().default(0),
  b8q6: integer("b8q6").notNull().default(0),
  b8q7: integer("b8q7").notNull().default(0),
  sumB8: integer("sumB8").notNull().default(0),
  totalDayScore: integer("totalDayScore").notNull().default(0),
  noteText: text("noteText"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyEntry = typeof dailyEntries.$inferSelect;
export type InsertDailyEntry = typeof dailyEntries.$inferInsert;

export const magicTokens = pgTable("magic_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MagicToken = typeof magicTokens.$inferSelect;
export type InsertMagicToken = typeof magicTokens.$inferInsert;

export const coachAccess = pgTable("coach_access", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  coachId: integer("coachId").notNull(),
  grantedAt: timestamp("grantedAt").defaultNow().notNull(),
  revokedAt: timestamp("revokedAt"),
  isActive: boolean("isActive").default(true).notNull(),
});

export type CoachAccess = typeof coachAccess.$inferSelect;
export type InsertCoachAccess = typeof coachAccess.$inferInsert;

export const appSettings = pgTable("app_settings", {
  key: varchar("key", { length: 128 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type AppSetting = typeof appSettings.$inferSelect;
