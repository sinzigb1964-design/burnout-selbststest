import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  CoachAccess,
  DailyEntry,
  InsertCoachAccess,
  InsertDailyEntry,
  InsertMagicToken,
  InsertTestCycle,
  InsertUser,
  MagicToken,
  TestCycle,
  User,
  coachAccess,
  dailyEntries,
  magicTokens,
  testCycles,
  users,
  appSettings,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── USER ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    const value = user[field];
    if (value === undefined) continue;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserById(id: number): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function updateUserConsent(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(users)
    .set({ consentGiven: true, consentGivenAt: new Date() })
    .where(eq(users.id, userId));
}

export async function deleteUserData(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  // Delete all related data first
  const cycles = await db.select().from(testCycles).where(eq(testCycles.userId, userId));
  for (const cycle of cycles) {
    await db.delete(dailyEntries).where(eq(dailyEntries.cycleId, cycle.id));
  }
  await db.delete(testCycles).where(eq(testCycles.userId, userId));
  await db.delete(coachAccess).where(eq(coachAccess.userId, userId));
  await db.delete(coachAccess).where(eq(coachAccess.coachId, userId));
  await db.delete(users).where(eq(users.id, userId));
}

export async function getAllUserData(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const user = await getUserById(userId);
  const cycles = await db.select().from(testCycles).where(eq(testCycles.userId, userId));
  const entries: DailyEntry[] = [];
  for (const cycle of cycles) {
    const cycleEntries = await db
      .select()
      .from(dailyEntries)
      .where(eq(dailyEntries.cycleId, cycle.id));
    entries.push(...cycleEntries);
  }
  return { user, cycles, entries };
}

// ─── TEST CYCLES ─────────────────────────────────────────────────────────────

export async function getActiveTestCycle(userId: number): Promise<TestCycle | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(testCycles)
    .where(and(eq(testCycles.userId, userId), eq(testCycles.status, "active")))
    .limit(1);
  return result[0];
}

export async function createTestCycle(data: InsertTestCycle): Promise<TestCycle> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(testCycles).values(data);
  const result = await db
    .select()
    .from(testCycles)
    .where(and(eq(testCycles.userId, data.userId!), eq(testCycles.status, "active")))
    .orderBy(desc(testCycles.createdAt))
    .limit(1);
  return result[0];
}

export async function completeTestCycle(cycleId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(testCycles)
    .set({ status: "completed", endDate: new Date() })
    .where(eq(testCycles.id, cycleId));
}

export async function getCompletedCycles(userId: number): Promise<TestCycle[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(testCycles)
    .where(and(eq(testCycles.userId, userId), eq(testCycles.status, "completed")))
    .orderBy(desc(testCycles.createdAt));
}

export async function getTestCycleById(cycleId: number): Promise<TestCycle | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(testCycles).where(eq(testCycles.id, cycleId)).limit(1);
  return result[0];
}

// ─── DAILY ENTRIES ───────────────────────────────────────────────────────────

export async function getDailyEntriesForCycle(cycleId: number): Promise<DailyEntry[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(dailyEntries)
    .where(eq(dailyEntries.cycleId, cycleId))
    .orderBy(dailyEntries.dayNumber);
}

export async function getTodayEntry(
  cycleId: number,
  dayNumber: number
): Promise<DailyEntry | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(dailyEntries)
    .where(and(eq(dailyEntries.cycleId, cycleId), eq(dailyEntries.dayNumber, dayNumber)))
    .limit(1);
  return result[0];
}

export async function saveDailyEntry(data: InsertDailyEntry): Promise<DailyEntry> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(dailyEntries).values(data);
  const result = await db
    .select()
    .from(dailyEntries)
    .where(
      and(eq(dailyEntries.cycleId, data.cycleId), eq(dailyEntries.dayNumber, data.dayNumber))
    )
    .limit(1);
  return result[0];
}

// ─── COACH ACCESS ─────────────────────────────────────────────────────────────

export async function grantCoachAccess(userId: number, coachId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  // Check if already exists
  const existing = await db
    .select()
    .from(coachAccess)
    .where(and(eq(coachAccess.userId, userId), eq(coachAccess.coachId, coachId)))
    .limit(1);
  if (existing[0]) {
    await db
      .update(coachAccess)
      .set({ isActive: true, revokedAt: null })
      .where(eq(coachAccess.id, existing[0].id));
  } else {
    await db.insert(coachAccess).values({ userId, coachId, isActive: true });
  }
}

export async function revokeCoachAccess(userId: number, coachId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(coachAccess)
    .set({ isActive: false, revokedAt: new Date() })
    .where(and(eq(coachAccess.userId, userId), eq(coachAccess.coachId, coachId)));
}

export async function getActiveCoachGrants(userId: number): Promise<CoachAccess[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(coachAccess)
    .where(and(eq(coachAccess.userId, userId), eq(coachAccess.isActive, true)));
}

export async function getCoachClients(coachId: number): Promise<{ access: CoachAccess; user: User }[]> {
  const db = await getDb();
  if (!db) return [];
  const grants = await db
    .select()
    .from(coachAccess)
    .where(and(eq(coachAccess.coachId, coachId), eq(coachAccess.isActive, true)));
  const result: { access: CoachAccess; user: User }[] = [];
  for (const grant of grants) {
    const user = await getUserById(grant.userId);
    if (user) result.push({ access: grant, user });
  }
  return result;
}

export async function hasCoachAccess(coachId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select()
    .from(coachAccess)
    .where(
      and(
        eq(coachAccess.coachId, coachId),
        eq(coachAccess.userId, userId),
        eq(coachAccess.isActive, true)
      )
    )
    .limit(1);
  return result.length > 0;
}

export async function getAllCoaches(): Promise<User[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).where(eq(users.isCoach, true));
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<User[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(users.createdAt);
}

export async function updateUserRole(userId: number, role: "user" | "admin"): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

export async function updateUserRoles(userId: number, isAdmin: boolean, isCoach: boolean): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const role: "user" | "admin" = isAdmin ? "admin" : "user";
  await db.update(users).set({ role, isCoach }).where(eq(users.id, userId));
}

export async function resetUserCycle(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  // Aktiven Zyklus finden
  const cycle = await getActiveTestCycle(userId);
  if (!cycle) return;
  // Alle Einträge des Zyklus löschen
  await db.delete(dailyEntries).where(eq(dailyEntries.cycleId, cycle.id));
  // Zyklus selbst löschen
  await db.delete(testCycles).where(eq(testCycles.id, cycle.id));
}

export async function getUserCycleInfo(userId: number): Promise<{
  activeCycle: TestCycle | undefined;
  completedCount: number;
  entryCount: number;
}> {
  const activeCycle = await getActiveTestCycle(userId);
  const completed = await getCompletedCycles(userId);
  let entryCount = 0;
  if (activeCycle) {
    const entries = await getDailyEntriesForCycle(activeCycle.id);
    entryCount = entries.length;
  }
  return { activeCycle, completedCount: completed.length, entryCount };
}

// ─── MAGIC LINK AUTH ──────────────────────────────────────────────────────────

/**
 * Findet einen User anhand der E-Mail-Adresse oder erstellt einen neuen.
 * Beim ersten Login wird der Vorname gespeichert.
 * Bei Folge-Logins bleibt der Name erhalten (kein Überschreiben).
 */
export async function findOrCreateUserByEmail(
  email: string,
  firstName?: string
): Promise<User> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Bestehenden User suchen
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  if (existing[0]) {
    // Vorname aktualisieren falls noch nicht gesetzt
    if (firstName && !existing[0].name) {
      await db
        .update(users)
        .set({ name: firstName, lastSignedIn: new Date() })
        .where(eq(users.id, existing[0].id));
      return { ...existing[0], name: firstName };
    }
    await db
      .update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, existing[0].id));
    return existing[0];
  }

  // Neuen User anlegen
  const openId = `email_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const insertData: InsertUser = {
    openId,
    email: email.toLowerCase().trim(),
    name: firstName || null,
    loginMethod: "magic_link",
    lastSignedIn: new Date(),
    consentGiven: true,
    consentGivenAt: new Date(),
  };
  await db.insert(users).values(insertData);

  const created = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);
  return created[0];
}

/**
 * Erstellt einen neuen Magic-Link-Token für einen User.
 * Gültig für 45 Minuten.
 */
export async function createMagicToken(userId: number, token: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const expiresAt = new Date(Date.now() + 45 * 60 * 1000); // 45 Minuten
  await db.insert(magicTokens).values({ userId, token, expiresAt });
}

/**
 * Prüft und verbraucht einen Magic-Link-Token.
 * Gibt den zugehörigen User zurück oder null wenn ungültig/abgelaufen.
 */
export async function verifyAndConsumeToken(token: string): Promise<User | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(magicTokens)
    .where(eq(magicTokens.token, token))
    .limit(1);

  const magicToken = result[0];
  if (!magicToken) return null;
  if (magicToken.usedAt) return null; // bereits verwendet
  if (new Date() > magicToken.expiresAt) return null; // abgelaufen

  // Token als verwendet markieren
  await db
    .update(magicTokens)
    .set({ usedAt: new Date() })
    .where(eq(magicTokens.id, magicToken.id));

  // User laden
  const user = await getUserById(magicToken.userId);
  return user ?? null;
}

/**
 * Löscht abgelaufene und bereits verwendete Tokens (Housekeeping).
 */
export async function cleanupExpiredTokens(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  // Tokens älter als 1 Stunde löschen
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  await db
    .delete(magicTokens)
    .where(eq(magicTokens.createdAt, oneHourAgo));
}

/**
 * Gibt den Unsubscribe-Token eines Users zurück (oder erstellt einen neuen).
 * Wird beim E-Mail-Versand verwendet um den Abmeldelink zu generieren.
 */
export async function getOrCreateUnsubscribeToken(userId: number): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const user = result[0];
  if (!user) throw new Error("User not found");

  if (user.unsubscribeToken) return user.unsubscribeToken;

  // Neuen Token generieren
  const { randomBytes } = await import("crypto");
  const token = randomBytes(32).toString("hex");
  await db.update(users).set({ unsubscribeToken: token }).where(eq(users.id, userId));
  return token;
}

/**
 * Verarbeitet eine Abmeldung über den Unsubscribe-Token.
 * Gibt den User zurück oder null wenn Token ungültig.
 */
export async function unsubscribeByToken(token: string): Promise<User | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.unsubscribeToken, token))
    .limit(1);

  const user = result[0];
  if (!user) return null;

  await db.update(users).set({ emailOptOut: true }).where(eq(users.id, user.id));
  return { ...user, emailOptOut: true };
}

/**
 * Prüft ob ein User E-Mails empfangen möchte.
 */
export async function isEmailOptedOut(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.select({ emailOptOut: users.emailOptOut })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0]?.emailOptOut ?? false;
}

// ─── APP SETTINGS ─────────────────────────────────────────────────────────────

const TEST_MODE_KEY = "testMode";

/**
 * Liest den aktuellen Test-Modus aus der Datenbank.
 * Fallback: ENV.testMode (aus Umgebungsvariable).
 */
export async function getTestModeSetting(): Promise<boolean> {
  const db = await getDb();
  if (!db) return ENV.testMode;

  const result = await db
    .select()
    .from(appSettings)
    .where(eq(appSettings.key, TEST_MODE_KEY))
    .limit(1);

  if (result[0]) {
    return result[0].value === "true";
  }
  // Noch kein DB-Eintrag → ENV-Wert als Startwert schreiben und zurückgeben
  await db
    .insert(appSettings)
    .values({ key: TEST_MODE_KEY, value: ENV.testMode ? "true" : "false" })
    .onDuplicateKeyUpdate({ set: { value: ENV.testMode ? "true" : "false" } });
  return ENV.testMode;
}

/**
 * Setzt den Test-Modus in der Datenbank.
 */
export async function setTestModeSetting(enabled: boolean): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .insert(appSettings)
    .values({ key: TEST_MODE_KEY, value: enabled ? "true" : "false" })
    .onDuplicateKeyUpdate({ set: { value: enabled ? "true" : "false" } });
}
