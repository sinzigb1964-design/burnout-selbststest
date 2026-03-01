/**
 * Brevo E-Mail-Helper für die automatische Erinnerungssequenz.
 * Alle drei Typen: Willkommen, tägliche Erinnerung, Abschluss.
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const SENDER = {
  name: "Bernd Sinzig – Burnout LIFEBACK\u00ae Guide",
  email: "info@insights.burnout-lifeback-guide.online",
};

interface SendEmailParams {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[email] BREVO_API_KEY not set – skipping email send");
    return false;
  }

  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: SENDER,
        to: [params.to],
        subject: params.subject,
        htmlContent: params.htmlContent,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[email] Brevo error:", err);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[email] Network error:", e);
    return false;
  }
}

// ─── E-Mail-Templates ─────────────────────────────────────────────────────────

function baseTemplate(content: string, unsubscribeUrl?: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Burnout Selbsttest</title>
  <style>
    @media only screen and (max-width: 620px) {
      .email-wrapper { padding: 12px 0 !important; }
      .email-card { border-radius: 0 !important; }
      .email-header { padding: 20px 20px !important; }
      .email-body { padding: 24px 20px 20px !important; }
      .email-footer { padding: 16px 20px !important; }
      .cta-button { display: block !important; text-align: center !important; padding: 14px 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
  <table width="100%" cellpadding="0" cellspacing="0" class="email-wrapper" style="background:#f5f7fa;padding:24px 0;">
    <tr><td align="center" style="padding:0 12px;">
      <table width="100%" cellpadding="0" cellspacing="0" class="email-card" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td class="email-header" style="background:#1a6b6b;padding:24px 32px;">
            <p style="margin:0;color:#ffffff;font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.8;">Burnout LIFEBACK&reg; Guide</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:20px;font-weight:700;line-height:1.3;">14-Tage Burnout-Selbsttest</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td class="email-body" style="padding:28px 32px 24px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td class="email-footer" style="background:#f0f4f4;padding:18px 32px;border-top:1px solid #e2e8e8;">
            <p style="margin:0;font-size:12px;color:#7a9090;line-height:1.6;word-break:break-word;">
              Diese E-Mail wurde automatisch vom Burnout Selbsttest-System gesendet.<br/>
              Bernd Sinzig &bull; Burnout LIFEBACK&reg; Guide &bull; <a href="https://selbsttest.burnout-lifeback-guide.click" style="color:#1a6b6b;">selbsttest.burnout-lifeback-guide.click</a>
            </p>
            ${unsubscribeUrl ? `<p style="margin:12px 0 0;font-size:11px;color:#aababa;word-break:break-word;">
              Du möchtest keine weiteren Erinnerungen erhalten?
              <a href="${unsubscribeUrl}" style="color:#aababa;text-decoration:underline;">Hier von automatischen E-Mails abmelden</a>
            </p>` : ""}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(url: string, label: string): string {
  return `<a href="${url}" class="cta-button" style="display:inline-block;background:#1a6b6b;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:700;margin:20px 0;max-width:100%;box-sizing:border-box;">${label}</a>`;
}

// ─── Willkommens-E-Mail ───────────────────────────────────────────────────────

export function buildWelcomeEmail(params: {
  firstName: string;
  appUrl: string;
  startDate: string;
  unsubscribeUrl?: string;
}): { subject: string; htmlContent: string } {
  const { firstName, appUrl, startDate, unsubscribeUrl } = params;
  const fragebogenUrl = `${appUrl}/fragebogen`;

  const content = `
    <h2 style="margin:0 0 16px;color:#1a2e2e;font-size:20px;">Hallo ${firstName},</h2>
    <p style="margin:0 0 16px;color:#3a5050;font-size:15px;line-height:1.7;">
      dein persönlicher <strong>14-Tage Burnout-Selbsttest</strong> hat heute begonnen (${startDate}).
      Herzlichen Glückwunsch – du hast einen wichtigen Schritt für deine Gesundheit gemacht.
    </p>
    <p style="margin:0 0 16px;color:#3a5050;font-size:15px;line-height:1.7;">
      <strong>Was dich erwartet:</strong> Jeden Tag beantwortest du 56 kurze Fragen zu 8 Lebensbereichen.
      Das dauert ca. 5–10 Minuten. Nach 14 Tagen erhältst du eine detaillierte, persönliche Auswertung
      mit Mustererkennung – entwickelt auf Basis meiner eigenen Burnout-Erfahrung und meiner Arbeit als Coach.
    </p>
    <p style="margin:0 0 8px;color:#3a5050;font-size:15px;line-height:1.7;">
      <strong>Mein Tipp:</strong> Fülle den Fragebogen jeden Tag zur gleichen Zeit aus – am besten abends,
      wenn du den Tag überblicken kannst.
    </p>
    ${ctaButton(fragebogenUrl, "Jetzt Tag 1 ausfüllen →")}
    <p style="margin:24px 0 0;color:#7a9090;font-size:13px;line-height:1.6;">
      Du erhältst täglich eine kurze Erinnerung, solange du den jeweiligen Tag noch nicht ausgefüllt hast.
    </p>
    <p style="margin:16px 0 0;color:#3a5050;font-size:14px;line-height:1.7;">
      Ich begleite dich auf diesem Weg,<br/>
      <strong>Bernd Sinzig</strong><br/>
      <span style="color:#7a9090;">Life- &amp; Businesscoach | Burnout LIFEBACK&reg; Guide</span>
    </p>`;

  return {
    subject: `🟢 Dein 14-Tage Burnout-Selbsttest hat begonnen – Tag 1 wartet auf dich`,
    htmlContent: baseTemplate(content, unsubscribeUrl),
  };
}

// ─── Tägliche Erinnerungs-E-Mail ─────────────────────────────────────────────

export function buildReminderEmail(params: {
  firstName: string;
  appUrl: string;
  dayNumber: number;
  daysLeft: number;
  unsubscribeUrl?: string;
}): { subject: string; htmlContent: string } {
  const { firstName, appUrl, dayNumber, daysLeft, unsubscribeUrl } = params;
  const fragebogenUrl = `${appUrl}/fragebogen`;

  const urgency = daysLeft <= 2
    ? `<p style="margin:0 0 16px;padding:12px 16px;background:#fff3cd;border-left:4px solid #f59e0b;border-radius:4px;color:#7a5a00;font-size:14px;">
        <strong>Noch ${daysLeft} ${daysLeft === 1 ? "Tag" : "Tage"} bis zum Abschluss</strong> – fast geschafft!
       </p>`
    : "";

  const content = `
    <h2 style="margin:0 0 16px;color:#1a2e2e;font-size:20px;">Guten Abend, ${firstName},</h2>
    <p style="margin:0 0 16px;color:#3a5050;font-size:15px;line-height:1.7;">
      bevor der Tag endet – hast du heute schon deinen Fragebogen ausgefüllt?
      Heute ist <strong>Tag ${dayNumber}</strong> deines 14-Tage Burnout-Selbsttests.
    </p>
    ${urgency}
    <p style="margin:0 0 16px;color:#3a5050;font-size:15px;line-height:1.7;">
      Jetzt, am Abend, hast du den besten Überblick über deinen Tag. Genau der richtige Moment,
      um ehrlich auf dich selbst zu schauen – es dauert nur 5–10 Minuten.
      Jeder ausgefüllte Tag macht dein Ergebnis aussagekräftiger.
    </p>
    ${ctaButton(fragebogenUrl, `Tag ${dayNumber} jetzt ausfüllen →`)}
    <p style="margin:12px 0 16px;font-size:12px;color:#7a9090;">
      Oder direkt aufrufen:
      <a href="${fragebogenUrl}" style="color:#1a6b6b;word-break:break-all;">${fragebogenUrl}</a>
    </p>
    <p style="margin:24px 0 0;color:#3a5050;font-size:14px;line-height:1.7;">
      Auf deinem Weg,<br/>
      <strong>Bernd Sinzig</strong><br/>
      <span style="color:#7a9090;">Life- &amp; Businesscoach | Burnout LIFEBACK&reg; Guide</span>
    </p>`;

  const subjectEmoji = daysLeft <= 2 ? "🔔" : "🌙";
  return {
    subject: `${subjectEmoji} Abend-Erinnerung: Tag ${dayNumber} deines Burnout-Selbsttests wartet auf dich`,
    htmlContent: baseTemplate(content, unsubscribeUrl),
  };
}

// ─── Abschluss-E-Mail ─────────────────────────────────────────────────────────

export function buildCompletionEmail(params: {
  firstName: string;
  appUrl: string;
  cycleId: number;
  unsubscribeUrl?: string;
}): { subject: string; htmlContent: string } {
  const { firstName, appUrl, cycleId, unsubscribeUrl } = params;
  const reportUrl = `${appUrl}/auswertung/${cycleId}`;

  const content = `
    <h2 style="margin:0 0 16px;color:#1a2e2e;font-size:20px;">Herzlichen Glückwunsch, ${firstName}!</h2>
    <p style="margin:0 0 16px;color:#3a5050;font-size:15px;line-height:1.7;">
      Du hast deinen <strong>14-Tage Burnout-Selbsttest abgeschlossen</strong>. Das ist keine Kleinigkeit –
      es braucht Konsequenz und den Mut, ehrlich auf sich selbst zu schauen.
    </p>
    <p style="margin:0 0 16px;padding:16px 20px;background:#f0f9f9;border-left:4px solid #1a6b6b;border-radius:4px;color:#1a4040;font-size:14px;line-height:1.7;">
      Dein persönlicher Auswertungsbericht ist jetzt verfügbar. Er zeigt dir deine Belastung in
      8 Lebensbereichen, erkannte Muster und konkrete Hinweise – entwickelt auf Basis evidenzbasierter
      Modelle und meiner eigenen Burnout-Erfahrung.
    </p>
    ${ctaButton(reportUrl, "Meinen Auswertungsbericht öffnen →")}
    <p style="margin:24px 0 16px;color:#3a5050;font-size:15px;line-height:1.7;">
      <strong>Was jetzt?</strong> Lies den Bericht in Ruhe. Lass die Zahlen auf dich wirken.
      Wenn du merkst, dass du Klarheit brauchst – nicht irgendwann, sondern jetzt – dann lass uns sprechen.
    </p>
    <p style="margin:0 0 8px;color:#3a5050;font-size:14px;line-height:1.7;font-style:italic;padding:12px 16px;background:#fff8f0;border-left:3px solid #c07830;border-radius:4px;">
      „Die meisten, die zu mir kommen, sagen: ich hätte früher kommen sollen. Nicht weil es dann leichter
      gewesen wäre, sondern weil sie Wochen, manchmal schon Monate verloren haben, in denen sie dachten,
      es wird schon von alleine.“
    </p>
    <p style="margin:16px 0 20px;color:#3a5050;font-size:14px;line-height:1.7;">
      Kein Verkaufsgespräch. Nur Klarheit, wo du wirklich stehst.
    </p>
    <a href="https://zeeg.me/bsinzig/P00U26"
       style="display:inline-block;padding:12px 24px;background:#c07830;color:#ffffff;text-decoration:none;
              border-radius:6px;font-size:14px;font-weight:600;margin-bottom:24px;">
      Gespräch mit Bernd vereinbaren →
    </a>
    <p style="margin:0;color:#3a5050;font-size:14px;line-height:1.7;">
      Mit Respekt für deinen Mut,<br/>
      <strong>Bernd Sinzig</strong><br/>
      <span style="color:#7a9090;">Life- &amp; Businesscoach | Burnout LIFEBACK&reg; Guide</span>
    </p>`;

  return {
    subject: `✅ Dein Burnout-Selbsttest ist abgeschlossen – dein Bericht ist bereit`,
    htmlContent: baseTemplate(content, unsubscribeUrl),
  };
}
