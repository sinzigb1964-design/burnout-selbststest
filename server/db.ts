import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  CoachAccess,
  DailyEntry,
  InsertCoachAccess,
  InsertDailyEntry,
  InsertTestCycle,
  InsertUser,
  TestCycle,
  User,
  coachAccess,
  dailyEntries,
  testCycles,
  users,
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
  return db.select().from(users).where(eq(users.role, "coach"));
}
