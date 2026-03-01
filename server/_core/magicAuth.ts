/**
 * Magic-Link Authentication Routes.
 * Ersetzt Manus-OAuth für den Burnout-Selbsttest.
 *
 * POST /api/auth/magic-link  → sendet Magic-Link per E-Mail
 * GET  /api/auth/verify      → verifiziert Token, setzt Session-Cookie
 * POST /api/auth/logout      → löscht Session-Cookie
 */

import crypto from "crypto";
import type { Express, Request, Response } from "express";
import { COOKIE_NAME } from "@shared/const";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { sendMagicLinkEmail } from "../emailMagicLink";

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
const APP_URL = process.env.APP_URL || "https://selbsttest.burnout-lifeback-guide.click";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerMagicAuthRoutes(app: Express) {
  /**
   * POST /api/auth/magic-link
   * Body: { email: string, firstName?: string }
   * Erstellt einen Magic-Link-Token und sendet ihn per E-Mail.
   */
  app.post("/api/auth/magic-link", async (req: Request, res: Response) => {
    const { email, firstName } = req.body as { email?: string; firstName?: string };

    if (!email || typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ error: "Gültige E-Mail-Adresse erforderlich." });
      return;
    }

    try {
      // User finden oder erstellen
      const user = await db.findOrCreateUserByEmail(email, firstName);
      const isNewUser = !user.lastSignedIn || 
        (Date.now() - new Date(user.lastSignedIn).getTime()) < 5000;

      // Sicheren Token generieren
      const token = crypto.randomBytes(48).toString("hex");
      await db.createMagicToken(user.id, token);

      // Magic-Link zusammenbauen
      // Frontend-Origin aus dem Request-Header lesen (falls vorhanden)
      const origin = req.headers["x-app-origin"] as string || APP_URL;
      const magicUrl = `${origin}/auth/verify?token=${token}`;

      // E-Mail senden
      const displayName = user.name?.split(" ")[0] || firstName || "du";
      await sendMagicLinkEmail({
        to: { email: user.email!, name: user.name || undefined },
        firstName: displayName,
        magicUrl,
        isNewUser,
      });

      res.json({ success: true, message: "Anmeldelink wurde gesendet." });
    } catch (err) {
      console.error("[magicAuth] Fehler beim Senden des Magic Links:", err);
      res.status(500).json({ error: "Fehler beim Senden der E-Mail." });
    }
  });

  /**
   * GET /api/auth/verify?token=...
   * Verifiziert den Token, setzt Session-Cookie und leitet weiter.
   */
  app.get("/api/auth/verify", async (req: Request, res: Response) => {
    const token = getQueryParam(req, "token");

    if (!token) {
      res.redirect("/?error=missing_token");
      return;
    }

    try {
      const user = await db.verifyAndConsumeToken(token);

      if (!user) {
        res.redirect("/login?error=invalid_token");
        return;
      }

      // Session-JWT erstellen (14 Tage gültig)
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || "",
        expiresInMs: FOURTEEN_DAYS_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: FOURTEEN_DAYS_MS,
      });

      // Weiterleitung zum Dashboard
      res.redirect(302, "/dashboard");
    } catch (err) {
      console.error("[magicAuth] Token-Verifizierung fehlgeschlagen:", err);
      res.redirect("/login?error=server_error");
    }
  });
}
