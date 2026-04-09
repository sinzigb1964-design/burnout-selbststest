/**
 * Täglicher Cron-Job für die Burnout-Selbsttest E-Mail-Sequenz.
 * Server-Zeitzone: EST (UTC-5). Ziel: 18:00 MEZ = 17:00 UTC = 12:00 EST.
 * Sendet Erinnerungs-E-Mails an alle Nutzer mit aktivem Zyklus,
 * die den heutigen Tag noch nicht ausgefüllt haben.
 */

import cron from "node-cron";
import {
  getAllUsers,
  getActiveTestCycle,
  getDailyEntriesForCycle,
  getOrCreateUnsubscribeToken,
} from "./db";
import {
  sendEmail,
  buildReminderEmail,
} from "./email";

const APP_URL = process.env.APP_URL || "https://selbsttest.burnout-lifeback-guide.click";

/**
 * Berechnet die aktuelle Tagnummer eines Zyklus (1–7).
 */
function getCurrentDayNumber(startDate: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  return Math.min(Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1, 7);
}

/**
 * Sendet Erinnerungs-E-Mails an alle Nutzer, die heute noch nicht ausgefüllt haben.
 */
export async function runDailyReminderJob(): Promise<void> {
  console.log("[emailCron] Starte täglichen Erinnerungs-Job...");

  try {
    const allUsers = await getAllUsers();
    let sent = 0;
    let skipped = 0;

    for (const user of allUsers) {
      if (!user.email) { skipped++; continue; }
      // DSGVO: Abgemeldete User überspringen
      if (user.emailOptOut) { skipped++; continue; }

      const cycle = await getActiveTestCycle(user.id);
      if (!cycle) { skipped++; continue; }

      const dayNumber = getCurrentDayNumber(new Date(cycle.startDate));
      if (dayNumber > 7) { skipped++; continue; }

      // Prüfen ob heute bereits ausgefüllt
      const entries = await getDailyEntriesForCycle(cycle.id);
      const alreadyFilled = entries.some((e) => e.dayNumber === dayNumber);
      if (alreadyFilled) { skipped++; continue; }

      const daysLeft = 7 - dayNumber + 1;
      const firstName = user.name?.split(" ")[0] || "du";

      // Abmeldelink generieren
      const unsubscribeToken = await getOrCreateUnsubscribeToken(user.id).catch(() => null);
      const unsubscribeUrl = unsubscribeToken
        ? `${APP_URL}/api/unsubscribe?token=${unsubscribeToken}`
        : undefined;

      const { subject, htmlContent } = buildReminderEmail({
        firstName,
        appUrl: APP_URL,
        dayNumber,
        daysLeft,
        unsubscribeUrl,
      });

      const ok = await sendEmail({
        to: { email: user.email, name: user.name || undefined },
        subject,
        htmlContent,
      });

      if (ok) {
        sent++;
        console.log(`[emailCron] Erinnerung gesendet an ${user.email} (Tag ${dayNumber})`);
      }
    }

    console.log(`[emailCron] Job abgeschlossen: ${sent} gesendet, ${skipped} übersprungen`);
  } catch (err) {
    console.error("[emailCron] Fehler im Erinnerungs-Job:", err);
  }
}

/**
 * Startet den Cron-Job.
 * Server läuft in EST (UTC-5).
 * Ziel: 18:00 MEZ = 17:00 UTC = 12:00 EST
 */
export function startEmailCron(): void {
  // 12:00 EST = 17:00 UTC = 18:00 MEZ (Normalzeit) / 19:00 MESZ (Sommerzeit)
  cron.schedule("0 12 * * *", async () => {
    await runDailyReminderJob();
  });
  console.log("[emailCron] Täglicher Erinnerungs-Job registriert (12:00 EST = 17:00 UTC = 18:00 MEZ)");
}
