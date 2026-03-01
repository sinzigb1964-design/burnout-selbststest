/**
 * Dynamischer Einleitungsabsatz für den individuellen Auswertungsbericht.
 *
 * Der Text wird aus vier Bausteinen zusammengesetzt:
 *   1. Persönliche Anrede mit Namen und Zeitraum
 *   2. Gesamtbelastungs-Aussage (low / medium / high)
 *   3. Bereichs-Hinweis (stärkste Belastung / auffälligste Muster)
 *   4. Einladender Abschluss
 */

import { computePatterns, getAreaLevel, getTotalLevel, QUESTIONNAIRE_AREAS } from "./questionnaire";

// ─── Hilfstexte ───────────────────────────────────────────────────────────────

/** Eröffnungssatz je nach Gesamtniveau */
const OPENING: Record<"low" | "medium" | "high", string> = {
  low:
    "Dein 14-Tage-Selbsttest ist abgeschlossen. Die gute Nachricht: Deine Gesamtbelastung liegt derzeit im milden Bereich. Das bedeutet nicht, dass alles perfekt ist – aber es zeigt, dass dein System noch über ausreichend Ressourcen verfügt.",
  medium:
    "Dein 14-Tage-Selbsttest ist abgeschlossen. Die Auswertung zeigt eine deutlich erhöhte Gesamtbelastung. Das ist ein klares Signal, das ernst genommen werden sollte – nicht als Urteil, sondern als ehrliche Rückmeldung deines Systems.",
  high:
    "Dein 14-Tage-Selbsttest ist abgeschlossen. Die Auswertung zeigt eine hohe Gesamtbelastung. Das, was du in den letzten Wochen gespürt hast, spiegelt sich in diesen Zahlen wider – und es ist wichtig, dass du diesen Bericht nicht alleine trägst.",
};

/** Mittelteil: Einordnung der Tagesanzahl */
function daysContext(daysCompleted: number): string {
  if (daysCompleted === 14) {
    return "Du hast alle 14 Tage lückenlos erfasst. Das ist eine bemerkenswerte Konsequenz und macht diese Auswertung besonders aussagekräftig.";
  }
  if (daysCompleted >= 10) {
    return `Du hast ${daysCompleted} von 14 Tagen erfasst. Das ist eine solide Grundlage für eine aussagekräftige Auswertung.`;
  }
  return `Du hast ${daysCompleted} von 14 Tagen erfasst. Die Auswertung gibt dir erste Hinweise, wird aber mit mehr Tagen noch präziser.`;
}

/** Bereichs-Satz: nennt die am stärksten belasteten Bereiche */
function areasContext(avgs: number[]): string {
  const redAreas = QUESTIONNAIRE_AREAS.filter((_, i) => getAreaLevel(avgs[i] ?? 0) === "red");
  const yellowAreas = QUESTIONNAIRE_AREAS.filter((_, i) => getAreaLevel(avgs[i] ?? 0) === "yellow");

  if (redAreas.length === 0 && yellowAreas.length === 0) {
    return "Alle acht Lebensbereiche zeigen sich derzeit im grünen Bereich – das ist ein ermutigender Befund.";
  }

  if (redAreas.length >= 5) {
    return `Besonders auffällig: Gleich ${redAreas.length} der acht Bereiche – darunter ${redAreas.slice(0, 3).map((a) => a.title).join(", ")} – zeigen stark erhöhte Werte. Das deutet auf eine systemische, nicht nur punktuelle Erschöpfung hin.`;
  }

  if (redAreas.length > 0) {
    const names = redAreas.map((a) => a.title).join(", ");
    return `Besonders auffällig sind die Bereiche ${names}, die stark erhöhte Werte zeigen und im Bericht besondere Aufmerksamkeit verdienen.`;
  }

  const names = yellowAreas.slice(0, 3).map((a) => a.title).join(", ");
  return `Die Bereiche ${names} zeigen deutlich erhöhte Werte und laden dich ein, genauer hinzuschauen.`;
}

/** Abschlusssatz je nach Gesamtniveau */
const CLOSING: Record<"low" | "medium" | "high", string> = {
  low:
    "Nutze diesen Bericht als Kompass: Er zeigt dir, wo du stehst – und wo du präventiv ansetzen kannst, bevor aus Müdigkeit Erschöpfung wird.",
  medium:
    "Dieser Bericht ist kein Urteil, sondern eine Einladung: Schau genau hin, nimm die Signale ernst – und such dir Unterstützung, wenn du sie brauchst.",
  high:
    "Dieser Bericht ist ein Zeichen, dass dein System Hilfe braucht. Bitte teile diese Ergebnisse mit einer Fachperson, der du vertraust – einem Coach, Therapeuten oder Arzt. Du musst das nicht alleine durcharbeiten.",
};

// ─── Hauptfunktion ────────────────────────────────────────────────────────────

export interface IntroTextParams {
  userName: string | undefined | null;
  daysCompleted: number;
  totalSum: number;
  avgs: number[];
  cycleStartDate: Date | string;
}

/**
 * Gibt den vollständigen, personalisierten Einleitungsabsatz zurück.
 * Besteht aus vier Sätzen: Anrede + Eröffnung · Tageskontext · Bereichskontext · Abschluss.
 */
export function buildIntroText(params: IntroTextParams): string {
  const { userName, daysCompleted, totalSum, avgs, cycleStartDate } = params;

  const firstName = userName?.split(" ")[0] ?? "du";
  const level = getTotalLevel(totalSum);
  const patterns = computePatterns(avgs);

  const startDate = new Date(cycleStartDate).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const greeting = `${firstName}, dein persönlicher Auswertungsbericht für den Zyklus ab dem ${startDate} liegt vor.`;
  const opening = OPENING[level];
  const days = daysContext(daysCompleted);
  const areas = areasContext(avgs);
  const patternHint =
    patterns.length > 0
      ? `Die Mustererkennung hat ${patterns.length === 1 ? "ein Belastungsmuster" : `${patterns.length} Belastungsmuster`} identifiziert (${patterns.join(", ")}), das du weiter unten im Bericht detailliert findest.`
      : "";
  const closing = CLOSING[level];

  return [greeting, opening, days, areas, patternHint, closing]
    .filter(Boolean)
    .join(" ");
}
