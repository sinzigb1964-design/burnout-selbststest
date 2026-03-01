/**
 * DSGVO-konformer Abmelde-Endpunkt für automatische E-Mails.
 *
 * GET /api/unsubscribe?token=...
 *   → Markiert den User als emailOptOut=true und leitet zur Bestätigungsseite weiter.
 */

import type { Express, Request, Response } from "express";
import * as db from "../db";

export function registerUnsubscribeRoute(app: Express) {
  app.get("/api/unsubscribe", async (req: Request, res: Response) => {
    const token = typeof req.query.token === "string" ? req.query.token : null;

    if (!token) {
      res.redirect("/abmeldung?status=invalid");
      return;
    }

    try {
      const user = await db.unsubscribeByToken(token);

      if (!user) {
        res.redirect("/abmeldung?status=invalid");
        return;
      }

      res.redirect("/abmeldung?status=success");
    } catch (err) {
      console.error("[unsubscribe] Fehler bei der Abmeldung:", err);
      res.redirect("/abmeldung?status=error");
    }
  });
}
