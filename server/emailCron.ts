/**
 * Täglicher Cron-Job für die Burnout-Selbsttest E-Mail-Sequenz.
 * Läuft täglich um 08:00 Uhr (Serverzeit / UTC).
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
 * Berechnet die aktuelle Tagnummer eines Zyklus (1–14).
 */
function getCurrentDayNumber(startDate: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  return Math.min(Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1, 14);
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
      if (dayNumber > 14) { skipped++; continue; }

      // Prüfen ob heute bereits ausgefüllt
      const entries = await getDailyEntriesForCycle(cycle.id);
      const alreadyFilled = entries.some((e) => e.dayNumber === dayNumber);
      if (alreadyFilled) { skipped++; continue; }

      const daysLeft = 14 - dayNumber + 1;
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
 * Startet den Cron-Job (täglich 08:00 Uhr UTC).
 */
export function startEmailCron(): void {
  // Täglich um 08:00 Uhr UTC (= 09:00 Uhr MEZ / 10:00 Uhr MESZ)
  cron.schedule("0 8 * * *", async () => {
    await runDailyReminderJob();
  });
  console.log("[emailCron] Täglicher Erinnerungs-Job registriert (08:00 UTC)");
}
