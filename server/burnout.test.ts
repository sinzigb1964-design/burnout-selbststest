import { describe, expect, it } from "vitest";
import {
  QUESTIONNAIRE_AREAS,
  computePatterns,
  getAreaLevel,
  getTotalLevel,
} from "../shared/questionnaire";

// ─── Questionnaire structure tests ────────────────────────────────────────────

describe("QUESTIONNAIRE_AREAS", () => {
  it("has exactly 8 areas", () => {
    expect(QUESTIONNAIRE_AREAS).toHaveLength(8);
  });

  it("each area has exactly 7 questions", () => {
    for (const area of QUESTIONNAIRE_AREAS) {
      expect(area.questions).toHaveLength(7);
    }
  });

  it("area IDs are 1 through 8", () => {
    const ids = QUESTIONNAIRE_AREAS.map((a) => a.id);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

// ─── getAreaLevel tests ────────────────────────────────────────────────────────

describe("getAreaLevel", () => {
  it("returns green for avg below 7", () => {
    expect(getAreaLevel(0)).toBe("green");
    expect(getAreaLevel(6.9)).toBe("green");
  });

  it("returns yellow for avg between 7 and 13.9", () => {
    expect(getAreaLevel(7)).toBe("yellow");
    expect(getAreaLevel(10)).toBe("yellow");
    expect(getAreaLevel(13.9)).toBe("yellow");
  });

  it("returns red for avg 14 and above", () => {
    expect(getAreaLevel(14)).toBe("red");
    expect(getAreaLevel(21)).toBe("red");
  });
});

// ─── getTotalLevel tests ───────────────────────────────────────────────────────

describe("getTotalLevel", () => {
  it("returns low for total below 56", () => {
    expect(getTotalLevel(0)).toBe("low");
    expect(getTotalLevel(55)).toBe("low");
  });

  it("returns medium for total between 57 and 112", () => {
    expect(getTotalLevel(57)).toBe("medium");
    expect(getTotalLevel(111)).toBe("medium");
  });

  it("returns high for total above 112", () => {
    expect(getTotalLevel(113)).toBe("high");
    expect(getTotalLevel(168)).toBe("high");
  });

  it("returns medium for total exactly 112", () => {
    expect(getTotalLevel(112)).toBe("medium");
  });
});

// ─── computePatterns tests ─────────────────────────────────────────────────────

describe("computePatterns", () => {
  it("returns empty array when all areas are green", () => {
    const avgs = [3, 3, 3, 3, 3, 3, 3, 3]; // all below 7
    const patterns = computePatterns(avgs);
    expect(patterns).toHaveLength(0);
  });

  it("detects pattern A2: sleep + energy both red (2 of 3 body areas)", () => {
    // B1 (Schlaf) and B2 (Energie) both >= 14
    const avgs = [15, 15, 3, 3, 3, 3, 3, 3];
    const patterns = computePatterns(avgs);
    expect(patterns).toContain("A2");
  });

  it("detects pattern A1: all three body areas red", () => {
    // B1, B2, B3 all >= 14
    const avgs = [15, 15, 15, 3, 3, 3, 3, 3];
    const patterns = computePatterns(avgs);
    expect(patterns).toContain("A1");
  });

  it("detects pattern C: cognitive + physical overload", () => {
    // B4 (Konzentration) and B5 (Koerper) both >= 14
    const avgs = [3, 3, 3, 15, 15, 3, 3, 3];
    const patterns = computePatterns(avgs);
    expect(patterns).toContain("C");
  });

  it("detects pattern B1: meaning loss + inner distance both red", () => {
    // B7 (Sinn) and B8 (Innere Distanz) both >= 14
    const avgs = [3, 3, 3, 3, 3, 3, 15, 15];
    const patterns = computePatterns(avgs);
    expect(patterns).toContain("B1");
  });

  it("can detect multiple patterns simultaneously", () => {
    const avgs = [15, 15, 15, 15, 15, 3, 3, 3];
    const patterns = computePatterns(avgs);
    expect(patterns).toContain("A1");
    expect(patterns).toContain("C");
  });

  it("accepts exactly 8 averages", () => {
    const avgs = [0, 0, 0, 0, 0, 0, 0, 0];
    expect(() => computePatterns(avgs)).not.toThrow();
  });
});

// ─── Auth logout test (from template) ─────────────────────────────────────────

import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type CookieCall = { name: string; options: Record<string, unknown> };
type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: CookieCall[] } {
  const clearedCookies: CookieCall[] = [];
  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    consentGiven: false,
    consentGivenAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };
  return { ctx, clearedCookies };
}

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({
      maxAge: -1,
      secure: true,
      sameSite: "none",
      httpOnly: true,
      path: "/",
    });
  });
});
