import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildWelcomeEmail,
  buildReminderEmail,
  buildCompletionEmail,
} from "./email";

describe("E-Mail-Templates", () => {
  describe("buildWelcomeEmail", () => {
    it("enthält den Vornamen des Nutzers", () => {
      const { subject, htmlContent } = buildWelcomeEmail({
        firstName: "Klaus",
        appUrl: "https://example.com",
        startDate: "01. März 2026",
      });
      expect(htmlContent).toContain("Klaus");
      expect(subject).toContain("begonnen");
    });

    it("enthält den Link zum Fragebogen", () => {
      const { htmlContent } = buildWelcomeEmail({
        firstName: "Anna",
        appUrl: "https://test.example.com",
        startDate: "01. März 2026",
      });
      expect(htmlContent).toContain("https://test.example.com/fragebogen");
    });

    it("enthält das Startdatum", () => {
      const { htmlContent } = buildWelcomeEmail({
        firstName: "Max",
        appUrl: "https://example.com",
        startDate: "15. Februar 2026",
      });
      expect(htmlContent).toContain("15. Februar 2026");
    });
  });

  describe("buildReminderEmail", () => {
    it("enthält die Tagnummer", () => {
      const { subject, htmlContent } = buildReminderEmail({
        firstName: "Bernd",
        appUrl: "https://example.com",
        dayNumber: 7,
        daysLeft: 8,
      });
      expect(htmlContent).toContain("Tag 7");
      expect(subject).toContain("Tag 7");
    });

    it("zeigt Dringlichkeitshinweis bei 2 verbleibenden Tagen", () => {
      const { htmlContent } = buildReminderEmail({
        firstName: "Bernd",
        appUrl: "https://example.com",
        dayNumber: 13,
        daysLeft: 2,
      });
      expect(htmlContent).toContain("Noch 2 Tage");
    });

    it("zeigt Dringlichkeitshinweis bei 1 verbleibendem Tag", () => {
      const { htmlContent } = buildReminderEmail({
        firstName: "Bernd",
        appUrl: "https://example.com",
        dayNumber: 14,
        daysLeft: 1,
      });
      expect(htmlContent).toContain("Noch 1 Tag");
    });

    it("zeigt keinen Dringlichkeitshinweis bei mehr als 2 Tagen", () => {
      const { htmlContent } = buildReminderEmail({
        firstName: "Bernd",
        appUrl: "https://example.com",
        dayNumber: 5,
        daysLeft: 10,
      });
      expect(htmlContent).not.toContain("Noch");
    });
  });

  describe("buildCompletionEmail", () => {
    it("enthält den Link zum Auswertungsbericht", () => {
      const { subject, htmlContent } = buildCompletionEmail({
        firstName: "Maria",
        appUrl: "https://example.com",
        cycleId: 42,
      });
      expect(htmlContent).toContain("https://example.com/auswertung/42");
      expect(subject).toContain("abgeschlossen");
    });

    it("enthält den Vornamen", () => {
      const { htmlContent } = buildCompletionEmail({
        firstName: "Maria",
        appUrl: "https://example.com",
        cycleId: 1,
      });
      expect(htmlContent).toContain("Maria");
    });
  });

  describe("HTML-Struktur", () => {
    it("alle Templates erzeugen valides HTML mit DOCTYPE", () => {
      const templates = [
        buildWelcomeEmail({ firstName: "Test", appUrl: "https://x.com", startDate: "01.01.2026" }),
        buildReminderEmail({ firstName: "Test", appUrl: "https://x.com", dayNumber: 3, daysLeft: 11 }),
        buildCompletionEmail({ firstName: "Test", appUrl: "https://x.com", cycleId: 1 }),
      ];
      for (const t of templates) {
        expect(t.htmlContent).toContain("<!DOCTYPE html>");
        expect(t.htmlContent).toContain("</html>");
        expect(t.subject.length).toBeGreaterThan(5);
      }
    });
  });
});
