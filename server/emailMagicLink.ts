/**
 * Magic-Link E-Mail-Template.
 * Separiert von email.ts um zirkuläre Abhängigkeiten zu vermeiden.
 * Responsive für Mobile-Geräte (kein seitlicher Scroll).
 */

import { sendEmail } from "./email";

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Burnout Selbsttest – Anmeldung</title>
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
        <tr>
          <td class="email-header" style="background:#1a6b6b;padding:24px 32px;">
            <p style="margin:0;color:#ffffff;font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.8;">Burnout LIFEBACK&reg; Guide</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:20px;font-weight:700;line-height:1.3;">14-Tage Burnout-Selbsttest</h1>
          </td>
        </tr>
        <tr>
          <td class="email-body" style="padding:28px 32px 24px;">
            ${content}
          </td>
        </tr>
        <tr>
          <td class="email-footer" style="background:#f0f4f4;padding:18px 32px;border-top:1px solid #e2e8e8;">
            <p style="margin:0;font-size:12px;color:#7a9090;line-height:1.6;word-break:break-word;">
              Dieser Link ist <strong>15 Minuten</strong> gültig und kann nur einmal verwendet werden.<br/>
              Falls du diese E-Mail nicht angefordert hast, kannst du sie ignorieren.<br/>
              Bernd Sinzig &bull; Burnout LIFEBACK&reg; Guide &bull; <a href="https://selbsttest.burnout-lifeback-guide.click" style="color:#1a6b6b;">selbsttest.burnout-lifeback-guide.click</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendMagicLinkEmail(params: {
  to: { email: string; name?: string };
  firstName: string;
  magicUrl: string;
  isNewUser: boolean;
}): Promise<boolean> {
  const { to, firstName, magicUrl, isNewUser } = params;

  const greeting = isNewUser
    ? `Willkommen beim 14-Tage Burnout-Selbsttest, ${firstName}!`
    : `Hallo ${firstName},`;

  const intro = isNewUser
    ? `<p style="margin:0 0 16px;color:#3a5050;font-size:15px;line-height:1.7;">
        Schön, dass du dabei bist. Klicke auf den Button, um dein Konto zu aktivieren
        und direkt mit dem Test zu beginnen.
       </p>`
    : `<p style="margin:0 0 16px;color:#3a5050;font-size:15px;line-height:1.7;">
        Du hast einen Anmeldelink angefordert. Klicke auf den Button, um dich anzumelden.
       </p>`;

  const content = `
    <h2 style="margin:0 0 16px;color:#1a2e2e;font-size:20px;">${greeting}</h2>
    ${intro}
    <div style="text-align:center;margin:28px 0;">
      <a href="${magicUrl}"
         class="cta-button"
         style="display:inline-block;background:#1a6b6b;color:#ffffff;text-decoration:none;
                padding:16px 40px;border-radius:8px;font-size:16px;font-weight:700;
                max-width:100%;box-sizing:border-box;">
        Jetzt anmelden →
      </a>
    </div>
    <p style="margin:0 0 8px;color:#7a9090;font-size:13px;text-align:center;">
      Oder kopiere diesen Link in deinen Browser:
    </p>
    <p style="margin:0;font-size:12px;color:#7a9090;text-align:center;word-break:break-all;">
      <a href="${magicUrl}" style="color:#1a6b6b;">${magicUrl}</a>
    </p>`;

  return sendEmail({
    to,
    subject: `🔑 Dein Anmeldelink für den Burnout Selbsttest`,
    htmlContent: baseTemplate(content),
  });
}
