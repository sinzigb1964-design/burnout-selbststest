import {
  boolean,
  float,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isCoach: boolean("isCoach").default(false).notNull(),
  // DSGVO: Einwilligung
  consentGiven: boolean("consentGiven").default(false).notNull(),
  consentGivenAt: timestamp("consentGivenAt"),
  // DSGVO: E-Mail-Abmeldung (Opt-out für automatische Erinnerungs-E-Mails)
  emailOptOut: boolean("emailOptOut").default(false).notNull(),
  unsubscribeToken: varchar("unsubscribeToken", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * A 14-day test cycle for a user.
 */
export const testCycles = mysqlTable("test_cycles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  status: mysqlEnum("status", ["active", "completed", "abandoned"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TestCycle = typeof testCycles.$inferSelect;
export type InsertTestCycle = typeof testCycles.$inferInsert;

/**
 * A single daily entry within a test cycle.
 * Stores all 56 answers (8 areas × 7 questions) and computed sums.
 */
export const dailyEntries = mysqlTable("daily_entries", {
  id: int("id").autoincrement().primaryKey(),
  cycleId: int("cycleId").notNull(),
  userId: int("userId").notNull(),
  dayNumber: int("dayNumber").notNull(), // 1–14
  entryDate: timestamp("entryDate").defaultNow().notNull(),

  // Area 1: Schlaf (B1, 7 answers, 0–3 each)
  b1q1: int("b1q1").notNull().default(0),
  b1q2: int("b1q2").notNull().default(0),
  b1q3: int("b1q3").notNull().default(0),
  b1q4: int("b1q4").notNull().default(0),
  b1q5: int("b1q5").notNull().default(0),
  b1q6: int("b1q6").notNull().default(0),
  b1q7: int("b1q7").notNull().default(0),
  sumB1: int("sumB1").notNull().default(0),

  // Area 2: Energie & Leistungskraft
  b2q1: int("b2q1").notNull().default(0),
  b2q2: int("b2q2").notNull().default(0),
  b2q3: int("b2q3").notNull().default(0),
  b2q4: int("b2q4").notNull().default(0),
  b2q5: int("b2q5").notNull().default(0),
  b2q6: int("b2q6").notNull().default(0),
  b2q7: int("b2q7").notNull().default(0),
  sumB2: int("sumB2").notNull().default(0),

  // Area 3: Nervensystem & Gefühle
  b3q1: int("b3q1").notNull().default(0),
  b3q2: int("b3q2").notNull().default(0),
  b3q3: int("b3q3").notNull().default(0),
  b3q4: int("b3q4").notNull().default(0),
  b3q5: int("b3q5").notNull().default(0),
  b3q6: int("b3q6").notNull().default(0),
  b3q7: int("b3q7").notNull().default(0),
  sumB3: int("sumB3").notNull().default(0),

  // Area 4: Konzentration & mentale Leistungskraft
  b4q1: int("b4q1").notNull().default(0),
  b4q2: int("b4q2").notNull().default(0),
  b4q3: int("b4q3").notNull().default(0),
  b4q4: int("b4q4").notNull().default(0),
  b4q5: int("b4q5").notNull().default(0),
  b4q6: int("b4q6").notNull().default(0),
  b4q7: int("b4q7").notNull().default(0),
  sumB4: int("sumB4").notNull().default(0),

  // Area 5: Körperliche Stresssignale
  b5q1: int("b5q1").notNull().default(0),
  b5q2: int("b5q2").notNull().default(0),
  b5q3: int("b5q3").notNull().default(0),
  b5q4: int("b5q4").notNull().default(0),
  b5q5: int("b5q5").notNull().default(0),
  b5q6: int("b5q6").notNull().default(0),
  b5q7: int("b5q7").notNull().default(0),
  sumB5: int("sumB5").notNull().default(0),

  // Area 6: Soziale Verbindung & Rückzug
  b6q1: int("b6q1").notNull().default(0),
  b6q2: int("b6q2").notNull().default(0),
  b6q3: int("b6q3").notNull().default(0),
  b6q4: int("b6q4").notNull().default(0),
  b6q5: int("b6q5").notNull().default(0),
  b6q6: int("b6q6").notNull().default(0),
  b6q7: int("b6q7").notNull().default(0),
  sumB6: int("sumB6").notNull().default(0),

  // Area 7: Sinn & Freude
  b7q1: int("b7q1").notNull().default(0),
  b7q2: int("b7q2").notNull().default(0),
  b7q3: int("b7q3").notNull().default(0),
  b7q4: int("b7q4").notNull().default(0),
  b7q5: int("b7q5").notNull().default(0),
  b7q6: int("b7q6").notNull().default(0),
  b7q7: int("b7q7").notNull().default(0),
  sumB7: int("sumB7").notNull().default(0),

  // Area 8: Innere Distanz zu anderen
  b8q1: int("b8q1").notNull().default(0),
  b8q2: int("b8q2").notNull().default(0),
  b8q3: int("b8q3").notNull().default(0),
  b8q4: int("b8q4").notNull().default(0),
  b8q5: int("b8q5").notNull().default(0),
  b8q6: int("b8q6").notNull().default(0),
  b8q7: int("b8q7").notNull().default(0),
  sumB8: int("sumB8").notNull().default(0),

  // Total day score (0–168)
  totalDayScore: int("totalDayScore").notNull().default(0),

  // Optional daily note / comment
  noteText: text("noteText"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyEntry = typeof dailyEntries.$inferSelect;
export type InsertDailyEntry = typeof dailyEntries.$inferInsert;

/**
 * Magic login tokens for passwordless authentication.
 * Each token is valid for 15 minutes and can only be used once.
 */
export const magicTokens = mysqlTable("magic_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MagicToken = typeof magicTokens.$inferSelect;
export type InsertMagicToken = typeof magicTokens.$inferInsert;

/**
 * Coach access grants: a user can grant a coach access to their results.
 */
export const coachAccess = mysqlTable("coach_access", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),       // the user granting access
  coachId: int("coachId").notNull(),     // the coach receiving access
  grantedAt: timestamp("grantedAt").defaultNow().notNull(),
  revokedAt: timestamp("revokedAt"),
  isActive: boolean("isActive").default(true).notNull(),
});

export type CoachAccess = typeof coachAccess.$inferSelect;
export type InsertCoachAccess = typeof coachAccess.$inferInsert;
