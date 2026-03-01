# Burnout Selbsttest – Projekt TODO

## Phase 1: Datenbank & Backend
- [x] Datenbankschema: users (erweitert), testCycles, dailyEntries, coachAccess
- [x] Backend: tRPC Router für Test-Zyklen (erstellen, Status prüfen)
- [x] Backend: tRPC Router für tägliche Einträge (speichern, abrufen)
- [x] Backend: Auswertungslogik (Durchschnitte, Schwellenwerte, Mustererkennung)
- [x] Backend: Coach-Zugriff (Freigabe erteilen/widerrufen, Ergebnisse abrufen)
- [x] Backend: DSGVO-Funktionen (Datenexport, Datenlöschung)
- [x] Datenbankmigrationen pushen

## Phase 2: Design & Landing Page
- [x] Design-System in index.css (Farben Teal-Blau + Warmsand, Inter-Font)
- [x] Landing Page mit Hero, 8-Bereiche-Preview, How-it-works, Features, CTA
- [x] Navigation mit Login-Button
- [x] DSGVO-Einwilligungsseite beim ersten Login (Art. 9 DSGVO)

## Phase 3: Fragebogen-Flow
- [x] Dashboard-Seite mit Fortschrittsanzeige (14-Tage-Zyklus, Tage-Dots)
- [x] Täglicher Fragebogen (8 Bereiche × 7 Fragen, Skala 0-3)
- [x] Motivations-Feedback nach täglichem Ausfüllen
- [x] Bereich-Navigation (Zurück/Weiter, Dots)

## Phase 4: Auswertung
- [x] Ergebnisseite nach Tag 14 (oder vorzeitig)
- [x] Balkendiagramme pro Bereich (grün/gelb/rot) mit Recharts
- [x] Bereichsspezifische Auswertungstexte
- [x] Gesamtbelastungsanzeige
- [x] Mustererkennung (Muster A1, A2, B1, B2, C, D, E1, E2, F)

## Phase 5: Coach-Ansicht & DSGVO
- [x] Coach-Freigabe-Seite (Freigabe erteilen/widerrufen)
- [x] Coach-Dashboard (Liste freigegebener Nutzer)
- [x] Coach-Klienten-Detail mit Auswertung und Diagramm
- [x] DSGVO: Datenexport als JSON (Art. 20 DSGVO)
- [x] DSGVO: Datenlöschfunktion (Konto + alle Daten, Art. 17 DSGVO)
- [x] Einstellungen-Seite mit Profil und DSGVO-Optionen

## Phase 6: Tests & Finalisierung
- [x] Vitest-Tests für Auswertungslogik (19 Tests, alle bestanden)
- [x] Vitest-Tests für Auth-Logout
- [x] TypeScript-Check: keine Fehler
- [x] Auth-Guard für alle geschützten Routen
- [x] Checkpoint erstellen

- [x] Alle Texte auf korrekte deutsche Umlaute und Rechtschreibung umgestellt

## Post-MVP (ausstehend)
- [x] Test-Modus: Tagessperre deaktivierbar für schnelles Durchlaufen des 14-Tage-Zyklus
- [ ] E-Mail-Benachrichtigungen (tägliche Erinnerung)
- [x] PDF-Export der Auswertung (ersetzt JSON-Export in Einstellungen)
- [x] Impressum und Datenschutzseiten (statisch)
- [x] Admin-Link im Dashboard (nur für Administratoren sichtbar)
- [ ] Mehrsprachigkeit (EN)
- [x] Admin-Panel: Nutzerliste, Zyklus-Übersicht und Zyklus-Reset für Admin (Bernd Sinzig)
- [x] Admin-Panel: Passwortschutz (separates Admin-Passwort, unabhängig vom Login)
- [x] Admin-Panel: Coach-Rollenvergabe und -entzug
- [x] Coach-Bereich-Kachel aus Dashboard entfernen und in Admin-Panel integrieren
- [x] Bugfix: Schlussseite Fragebogen zeigt Tag N+1 statt Tag N (Off-by-One-Fehler)
- [x] Dashboard.tsx: Alle ASCII-Umschreibungen durch korrekte Umlaute ersetzen
- [x] Impressum-Seite (/impressum) erstellen
- [x] Datenschutzerklärung-Seite (/datenschutz) erstellen
- [x] Einheitlicher Footer mit Impressum/Datenschutz-Links auf allen Seiten
- [x] Admin-Panel: Mehrfach-Rollenvergabe (Admin + Coach gleichzeitig möglich)
- [x] Bugfix: Zurück-Link in Datenschutz- und Impressum-Kopfzeile führt auf 404
- [x] PDF-Export: Balkendiagramm-Grafik aus dem Auswertungsbericht einbetten
- [x] PDF-Diagramm: Kürzel B1–B8 durch vollständige Bereichsnamen mit schräger Beschriftung ersetzen
- [x] PDF-Fußzeile: Text auf 'Selbsttest Burnout Belastung . Burnout LIFEBACK™ Guide 2026' geändert
- [x] PDF-Export: Liniendiagramm Gesamtscore über 14 Tage hinzugefügt
- [x] Auswertungsseite: Drucken-Button für direkten PDF-Export hinzugefügt
- [x] PDF-Tagesverlauf: T1–T14 durch 'Tag 1'–'Tag 14' ersetzt
- [x] Tagesnotizen: noteText-Feld in dailyEntries-Tabelle hinzufügen
- [x] Tagesnotizen: Notiz-Eingabefeld im Fragebogen (letzte Seite)
- [x] Tagesnotizen: Notizen in der Auswertungsseite anzeigen
- [x] Tagesnotizen: Notizen im PDF-Export einbetten
- [x] Einleitungsabsatz: Dynamisch personalisierten Einleitungstext für Auswertungsbericht erstellen (Name, Datum, Gesamtscore, Belastungsniveau, Tage)
- [x] Einleitungsabsatz: In Auswertungsseite (Auswertung.tsx) als erstes Element einbinden
- [x] Einleitungsabsatz: In PDF-Export (generatePdf.ts) nach dem Header einbinden
- [x] Einleitungsabsatz: In Coach-Klienten-Detailansicht (CoachKlient.tsx) einbinden
- [x] Bugfix: React Error #310 (useMemo) auf Auswertungsseite nach Abschluss des letzten Tages
- [ ] Login-Seite: Platzhalter-iframe für externes E-Mail-Anmeldeformular einbauen
- [x] E-Mail-Sequenz: Brevo API-Key als Secret eintragen
- [x] E-Mail-Sequenz: Brevo-Helper (server/email.ts) mit sendEmail-Funktion
- [x] E-Mail-Sequenz: Willkommens-E-Mail bei Zyklusstart
- [x] E-Mail-Sequenz: Täglicher Cron-Job für Erinnerungs-E-Mails (nur wenn nicht ausgefüllt)
- [x] E-Mail-Sequenz: Abschluss-E-Mail mit Link zum Auswertungsbericht
- [x] Magic-Link-Login: magicTokens-Tabelle im Datenbankschema hinzufügen
- [x] Magic-Link-Login: Server-Routen (requestLink, verifyToken, logout)
- [x] Magic-Link-Login: Magic-Link E-Mail-Template in email.ts
- [x] Magic-Link-Login: Login-Seite (Vorname + E-Mail Eingabe)
- [x] Magic-Link-Login: Verify-Seite (Token aus URL prüfen, Session setzen)
- [x] Magic-Link-Login: Manus-OAuth aus App entfernen, Auth-Kontext anpassen
- [x] Magic-Link-Login: Session 14 Tage gültig
- [x] Auswertungsbericht: Verständliche Bezeichnungen und Erklärungen für erkannte Belastungsmuster
- [x] Bugfix: NotFoundError (removeChild) beim Login-Versuch eines bereits registrierten Users
- [x] DSGVO: emailOptOut-Feld und unsubscribeToken in users-Tabelle
- [x] DSGVO: Server-Route GET /api/unsubscribe?token=... zum Abmelden
- [x] DSGVO: E-Mail-Versand-Guard (keine E-Mails an abgemeldete User)
- [x] DSGVO: Abmeldelink in alle E-Mail-Templates (Willkommen, Erinnerung, Abschluss)
- [x] DSGVO: Bestätigungsseite /abmeldung im Frontend
