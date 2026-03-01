import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  completeTestCycle,
  createTestCycle,
  deleteUserData,
  getAllCoaches,
  getAllUserData,
  getActiveCoachGrants,
  getActiveTestCycle,
  getCoachClients,
  getCompletedCycles,
  getDailyEntriesForCycle,
  getTestCycleById,
  getTodayEntry,
  getUserById,
  grantCoachAccess,
  hasCoachAccess,
  revokeCoachAccess,
  saveDailyEntry,
  updateUserConsent,
} from "./db";
import { computePatterns, getAreaLevel, getTotalLevel } from "../shared/questionnaire";

// ─── ANSWER SCHEMA ────────────────────────────────────────────────────────────

const answerValue = z.number().int().min(0).max(3);

const dailyAnswersSchema = z.object({
  b1q1: answerValue, b1q2: answerValue, b1q3: answerValue, b1q4: answerValue,
  b1q5: answerValue, b1q6: answerValue, b1q7: answerValue,
  b2q1: answerValue, b2q2: answerValue, b2q3: answerValue, b2q4: answerValue,
  b2q5: answerValue, b2q6: answerValue, b2q7: answerValue,
  b3q1: answerValue, b3q2: answerValue, b3q3: answerValue, b3q4: answerValue,
  b3q5: answerValue, b3q6: answerValue, b3q7: answerValue,
  b4q1: answerValue, b4q2: answerValue, b4q3: answerValue, b4q4: answerValue,
  b4q5: answerValue, b4q6: answerValue, b4q7: answerValue,
  b5q1: answerValue, b5q2: answerValue, b5q3: answerValue, b5q4: answerValue,
  b5q5: answerValue, b5q6: answerValue, b5q7: answerValue,
  b6q1: answerValue, b6q2: answerValue, b6q3: answerValue, b6q4: answerValue,
  b6q5: answerValue, b6q6: answerValue, b6q7: answerValue,
  b7q1: answerValue, b7q2: answerValue, b7q3: answerValue, b7q4: answerValue,
  b7q5: answerValue, b7q6: answerValue, b7q7: answerValue,
  b8q1: answerValue, b8q2: answerValue, b8q3: answerValue, b8q4: answerValue,
  b8q5: answerValue, b8q6: answerValue, b8q7: answerValue,
});

function computeSums(answers: z.infer<typeof dailyAnswersSchema>) {
  const sumB1 = answers.b1q1 + answers.b1q2 + answers.b1q3 + answers.b1q4 + answers.b1q5 + answers.b1q6 + answers.b1q7;
  const sumB2 = answers.b2q1 + answers.b2q2 + answers.b2q3 + answers.b2q4 + answers.b2q5 + answers.b2q6 + answers.b2q7;
  const sumB3 = answers.b3q1 + answers.b3q2 + answers.b3q3 + answers.b3q4 + answers.b3q5 + answers.b3q6 + answers.b3q7;
  const sumB4 = answers.b4q1 + answers.b4q2 + answers.b4q3 + answers.b4q4 + answers.b4q5 + answers.b4q6 + answers.b4q7;
  const sumB5 = answers.b5q1 + answers.b5q2 + answers.b5q3 + answers.b5q4 + answers.b5q5 + answers.b5q6 + answers.b5q7;
  const sumB6 = answers.b6q1 + answers.b6q2 + answers.b6q3 + answers.b6q4 + answers.b6q5 + answers.b6q6 + answers.b6q7;
  const sumB7 = answers.b7q1 + answers.b7q2 + answers.b7q3 + answers.b7q4 + answers.b7q5 + answers.b7q6 + answers.b7q7;
  const sumB8 = answers.b8q1 + answers.b8q2 + answers.b8q3 + answers.b8q4 + answers.b8q5 + answers.b8q6 + answers.b8q7;
  const totalDayScore = sumB1 + sumB2 + sumB3 + sumB4 + sumB5 + sumB6 + sumB7 + sumB8;
  return { sumB1, sumB2, sumB3, sumB4, sumB5, sumB6, sumB7, sumB8, totalDayScore };
}

function computeEvaluation(entries: { sumB1: number; sumB2: number; sumB3: number; sumB4: number; sumB5: number; sumB6: number; sumB7: number; sumB8: number }[]) {
  const n = entries.length;
  if (n === 0) return null;

  const avgB1 = entries.reduce((s, e) => s + e.sumB1, 0) / n;
  const avgB2 = entries.reduce((s, e) => s + e.sumB2, 0) / n;
  const avgB3 = entries.reduce((s, e) => s + e.sumB3, 0) / n;
  const avgB4 = entries.reduce((s, e) => s + e.sumB4, 0) / n;
  const avgB5 = entries.reduce((s, e) => s + e.sumB5, 0) / n;
  const avgB6 = entries.reduce((s, e) => s + e.sumB6, 0) / n;
  const avgB7 = entries.reduce((s, e) => s + e.sumB7, 0) / n;
  const avgB8 = entries.reduce((s, e) => s + e.sumB8, 0) / n;

  const avgs = [avgB1, avgB2, avgB3, avgB4, avgB5, avgB6, avgB7, avgB8];
  const totalSum = avgs.reduce((s, v) => s + v, 0);
  const patterns = computePatterns(avgs);
  const areaLevels = avgs.map((avg) => getAreaLevel(avg));
  const totalLevel = getTotalLevel(totalSum);

  return {
    avgs,
    totalSum,
    patterns,
    areaLevels,
    totalLevel,
    daysCompleted: n,
  };
}

// ─── ROUTERS ──────────────────────────────────────────────────────────────────

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    giveConsent: protectedProcedure.mutation(async ({ ctx }) => {
      await updateUserConsent(ctx.user.id);
      return { success: true };
    }),
  }),

  // ─── TEST CYCLE ──────────────────────────────────────────────────────────────
  cycle: router({
    status: protectedProcedure.query(async ({ ctx }) => {
      const active = await getActiveTestCycle(ctx.user.id);
      const completed = await getCompletedCycles(ctx.user.id);
      return { active, completed };
    }),

    start: protectedProcedure.mutation(async ({ ctx }) => {
      const existing = await getActiveTestCycle(ctx.user.id);
      if (existing) throw new TRPCError({ code: "BAD_REQUEST", message: "Ein aktiver Zyklus laeuft bereits." });
      const cycle = await createTestCycle({ userId: ctx.user.id, status: "active" });
      return cycle;
    }),

    complete: protectedProcedure.mutation(async ({ ctx }) => {
      const active = await getActiveTestCycle(ctx.user.id);
      if (!active) throw new TRPCError({ code: "NOT_FOUND", message: "Kein aktiver Zyklus gefunden." });
      await completeTestCycle(active.id);
      return { success: true };
    }),

    getEvaluation: protectedProcedure
      .input(z.object({ cycleId: z.number() }))
      .query(async ({ ctx, input }) => {
        const cycle = await getTestCycleById(input.cycleId);
        if (!cycle || cycle.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const entries = await getDailyEntriesForCycle(input.cycleId);
        const evaluation = computeEvaluation(entries);
        return { cycle, entries, evaluation };
      }),
  }),

  // ─── DAILY ENTRY ─────────────────────────────────────────────────────────────
  entry: router({
    today: protectedProcedure.query(async ({ ctx }) => {
      const cycle = await getActiveTestCycle(ctx.user.id);
      if (!cycle) return { cycle: null, entry: null, dayNumber: null };

      const startDate = new Date(cycle.startDate);
      const now = new Date();
      const diffMs = now.getTime() - startDate.getTime();
      const dayNumber = Math.min(Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1, 14);

      const entry = await getTodayEntry(cycle.id, dayNumber);
      return { cycle, entry, dayNumber };
    }),

    submit: protectedProcedure
      .input(dailyAnswersSchema)
      .mutation(async ({ ctx, input }) => {
        const cycle = await getActiveTestCycle(ctx.user.id);
        if (!cycle) throw new TRPCError({ code: "NOT_FOUND", message: "Kein aktiver Zyklus." });

        const startDate = new Date(cycle.startDate);
        const now = new Date();
        const diffMs = now.getTime() - startDate.getTime();
        const dayNumber = Math.min(Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1, 14);

        const existing = await getTodayEntry(cycle.id, dayNumber);
        if (existing) throw new TRPCError({ code: "BAD_REQUEST", message: "Heute bereits ausgefuellt." });

        const sums = computeSums(input);
        const entry = await saveDailyEntry({
          cycleId: cycle.id,
          userId: ctx.user.id,
          dayNumber,
          ...input,
          ...sums,
        });

        // Auto-complete after day 14
        if (dayNumber >= 14) {
          await completeTestCycle(cycle.id);
        }

        return { entry, dayNumber, isComplete: dayNumber >= 14 };
      }),

    history: protectedProcedure
      .input(z.object({ cycleId: z.number() }))
      .query(async ({ ctx, input }) => {
        const cycle = await getTestCycleById(input.cycleId);
        if (!cycle || cycle.userId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        return getDailyEntriesForCycle(input.cycleId);
      }),
  }),

  // ─── COACH ACCESS ─────────────────────────────────────────────────────────────
  coach: router({
    listCoaches: protectedProcedure.query(async () => {
      return getAllCoaches();
    }),

    myGrants: protectedProcedure.query(async ({ ctx }) => {
      const grants = await getActiveCoachGrants(ctx.user.id);
      const result = [];
      for (const grant of grants) {
        const coach = await getUserById(grant.coachId);
        if (coach) result.push({ grant, coach });
      }
      return result;
    }),

    grant: protectedProcedure
      .input(z.object({ coachId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const coach = await getUserById(input.coachId);
        if (!coach || coach.role !== "coach") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Ungültige Coach-ID." });
        }
        await grantCoachAccess(ctx.user.id, input.coachId);
        return { success: true };
      }),

    revoke: protectedProcedure
      .input(z.object({ coachId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await revokeCoachAccess(ctx.user.id, input.coachId);
        return { success: true };
      }),

    // Coach-only: view clients
    myClients: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "coach" && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return getCoachClients(ctx.user.id);
    }),

    // Coach-only: view client evaluation
    clientEvaluation: protectedProcedure
      .input(z.object({ userId: z.number(), cycleId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "coach" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const hasAccess = await hasCoachAccess(ctx.user.id, input.userId);
        if (!hasAccess) throw new TRPCError({ code: "FORBIDDEN" });

        const cycle = await getTestCycleById(input.cycleId);
        if (!cycle || cycle.userId !== input.userId) throw new TRPCError({ code: "NOT_FOUND" });

        const entries = await getDailyEntriesForCycle(input.cycleId);
        const evaluation = computeEvaluation(entries);
        const user = await getUserById(input.userId);
        const completedCycles = await getCompletedCycles(input.userId);
        return { user, cycle, entries, evaluation, completedCycles };
      }),

    clientCycles: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "coach" && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const hasAccess = await hasCoachAccess(ctx.user.id, input.userId);
        if (!hasAccess) throw new TRPCError({ code: "FORBIDDEN" });
        return getCompletedCycles(input.userId);
      }),
  }),

  // ─── GDPR ─────────────────────────────────────────────────────────────────────
  gdpr: router({
    exportData: protectedProcedure.query(async ({ ctx }) => {
      const data = await getAllUserData(ctx.user.id);
      return data;
    }),

    deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
      await deleteUserData(ctx.user.id);
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
