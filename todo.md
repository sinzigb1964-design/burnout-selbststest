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
- [ ] E-Mail-Benachrichtigungen (tägliche Erinnerung)
- [ ] PDF-Export der Auswertung
- [ ] Impressum und Datenschutzseiten (statisch)
- [ ] Admin-Panel für Coach-Rollenvergabe
- [ ] Mehrsprachigkeit (EN)
