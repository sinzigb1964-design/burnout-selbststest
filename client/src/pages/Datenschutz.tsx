import { Button } from "@/components/ui/button";
import AppFooter from "@/components/AppFooter";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function Datenschutz() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Burnout Selbsttest</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            ← Zurück zur Startseite
          </Button>
        </div>
      </nav>

      <div className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Datenschutzerklärung</h1>
        <p className="text-sm text-muted-foreground mb-8">Version 15.12.2025</p>

        <div className="space-y-8 text-foreground">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Datenschutz auf einen Blick</h2>
            <p className="text-muted-foreground mb-3">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
              personenbezogenen Daten passiert, wenn Sie diese App nutzen. Personenbezogene Daten
              sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>

            <h3 className="font-medium mb-1">Wer ist verantwortlich für die Datenerfassung?</h3>
            <p className="text-muted-foreground mb-3">
              Die Datenverarbeitung erfolgt durch den App-Betreiber. Dessen Kontaktdaten finden Sie
              im Abschnitt „Hinweis zur verantwortlichen Stelle".
            </p>

            <h3 className="font-medium mb-1">Wie erfassen wir Ihre Daten?</h3>
            <p className="text-muted-foreground mb-3">
              Ihre Daten werden dadurch erhoben, dass Sie diese uns mitteilen – insbesondere durch
              die tägliche Beantwortung des Fragebogens sowie bei der Registrierung. Andere Daten
              werden automatisch beim Besuch der App durch unsere IT-Systeme erfasst (z. B.
              technische Daten wie Browsertyp, Betriebssystem, Uhrzeit des Seitenaufrufs).
            </p>

            <h3 className="font-medium mb-1">Welche Rechte haben Sie bezüglich Ihrer Daten?</h3>
            <p className="text-muted-foreground">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und
              Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem das
              Recht auf Berichtigung oder Löschung dieser Daten. Wenn Sie eine Einwilligung zur
              Datenverarbeitung erteilt haben, können Sie diese jederzeit für die Zukunft widerrufen.
              Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der
              Verarbeitung zu verlangen sowie ein Beschwerderecht bei der zuständigen
              Aufsichtsbehörde.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Allgemeine Hinweise und Informationen</h2>
            <p className="text-muted-foreground mb-3">
              Die Betreiber dieser App nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
              behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>

            <h3 className="font-medium mb-2">Hinweis zur verantwortlichen Stelle</h3>
            <p className="text-muted-foreground">
              Die verantwortliche Stelle für die Datenverarbeitung in dieser App ist:
            </p>
            <address className="not-italic text-muted-foreground mt-2 space-y-0.5">
              <p>Bernd Sinzig</p>
              <p>c/o payroll-unlimited Inh.: Bernd Sinzig</p>
              <p>Spitalgasse 28</p>
              <p>3011 Bern, Schweiz</p>
              <p className="mt-2">
                Telefon:{" "}
                <a href="tel:+41789183095" className="text-primary hover:underline">
                  078 918 30 95
                </a>
              </p>
              <p>
                E-Mail:{" "}
                <a
                  href="mailto:info@burnout-lifeback-guide.online"
                  className="text-primary hover:underline"
                >
                  info@burnout-lifeback-guide.online
                </a>
              </p>
            </address>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Erhebung und Bearbeitung von Personendaten</h2>
            <p className="text-muted-foreground">
              Wir bearbeiten in erster Linie die Personendaten, die wir im Rahmen der Nutzung dieser
              App von Ihnen erhalten. Dazu gehören insbesondere: Name, E-Mail-Adresse, die täglichen
              Fragebogen-Antworten sowie die daraus berechneten Auswertungsdaten. Diese Daten werden
              ausschließlich für den Betrieb der App und die Bereitstellung der Auswertung verwendet.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Zweck der Datenbearbeitung</h2>
            <p className="text-muted-foreground mb-2">
              Wir verwenden die erhobenen Personendaten für folgende Zwecke:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Bereitstellung und Betrieb der Burnout-Selbsttest-App</li>
              <li>Berechnung und Darstellung der 14-Tage-Auswertung</li>
              <li>Optionale Freigabe der Ergebnisse an einen Coach (nur mit Ihrer ausdrücklichen Einwilligung)</li>
              <li>Weiterentwicklung und Verbesserung des Angebots</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Soweit Sie uns eine Einwilligung zur Bearbeitung Ihrer Personaldaten für bestimmte
              Zwecke erteilt haben, bearbeiten wir Ihre Personendaten auf dieser Grundlage. Sie
              können erteilte Einwilligungen jederzeit widerrufen.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Besondere Kategorien personenbezogener Daten</h2>
            <p className="text-muted-foreground">
              Diese App verarbeitet Gesundheitsdaten im Sinne von Art. 9 DSGVO (Angaben zur
              psychischen Belastung). Die Verarbeitung erfolgt ausschließlich auf Grundlage Ihrer
              ausdrücklichen Einwilligung (Art. 9 Abs. 2 lit. a DSGVO), die Sie beim ersten Login
              erteilen. Sie können diese Einwilligung jederzeit in den Einstellungen widerrufen,
              was zur Löschung Ihres Kontos und aller gespeicherten Daten führt.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Cookies und Sitzungsverwaltung</h2>
            <p className="text-muted-foreground mb-2">
              Diese App verwendet ein technisch notwendiges Session-Cookie zur Authentifizierung
              (HTTP-only, Secure, SameSite=None). Dieses Cookie ist für den Betrieb der App
              zwingend erforderlich und enthält keine personenbezogenen Daten außer einer
              verschlüsselten Sitzungskennung. Es werden keine Tracking- oder Werbe-Cookies
              eingesetzt.
            </p>
            <p className="text-muted-foreground">
              Die App verwendet SSL/TLS-Verschlüsselung zum Schutz aller übertragenen Daten.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Server-Log-Dateien</h2>
            <p className="text-muted-foreground mb-2">
              Der Provider dieser App erhebt und speichert automatisch Informationen in
              Server-Log-Dateien, die Ihr Browser automatisch übermittelt:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Browsertyp und Browserversion</li>
              <li>Verwendetes Betriebssystem</li>
              <li>Referenz-URL</li>
              <li>Hostname des zugreifenden Rechners</li>
              <li>Zeitpunkt der Serveranfrage</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              Diese Daten werden anonymisiert gespeichert und nicht mit anderen Datenquellen
              zusammengeführt.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Dauer der Aufbewahrung</h2>
            <p className="text-muted-foreground">
              Wir verarbeiten und speichern Ihre Personendaten, solange es für die Bereitstellung
              der App-Funktionen erforderlich ist. Sobald Sie Ihr Konto löschen (möglich in den
              Einstellungen), werden alle Ihre personenbezogenen Daten und Testergebnisse
              unwiderruflich gelöscht.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Datensicherheit</h2>
            <p className="text-muted-foreground">
              Wir treffen technische und organisatorische Sicherheitsvorkehrungen zum Schutz Ihrer
              Personendaten vor unberechtigtem Zugriff und Missbrauch – insbesondere durch
              Verschlüsselung der Datensysteme und der laufenden Datenübermittlungen (SSL/TLS).
              Passwörter werden nicht im Klartext gespeichert.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Ihre Rechte</h2>
            <p className="text-muted-foreground mb-2">
              Sie haben im Rahmen des Datenschutzrechts folgende Rechte:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO) – direkt in den App-Einstellungen ausübbar</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO) – PDF-Export in den Einstellungen</li>
              <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
              <li>Recht auf Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Jede Person hat überdies das Recht, ihre Ansprüche gerichtlich durchzusetzen oder bei
              der zuständigen Datenschutzbehörde eine Beschwerde einzureichen. Die zuständige
              Datenschutzbehörde der Schweiz ist der Eidgenössische Datenschutz- und
              Öffentlichkeitsbeauftragte (
              <a
                href="http://www.edoeb.admin.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                www.edoeb.admin.ch
              </a>
              ).
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">11. Änderungsvorbehalt</h2>
            <p className="text-muted-foreground">
              Wir können diese Datenschutzerklärung jederzeit ohne Vorankündigung anpassen. Es gilt
              die jeweils aktuelle, in der App veröffentlichte Version.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-border flex gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/impressum")}>
            Impressum
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            Zur Startseite
          </Button>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
