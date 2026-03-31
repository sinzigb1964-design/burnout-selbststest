/**
 * Dynamische Abschlusstexte für den Auswertungsbericht.
 * Drei Varianten je nach Belastungsniveau – verfasst in der Stimme von Bernd Sinzig.
 */

export interface ClosingText {
  /** Überschrift über dem Abschlusstext */
  heading: string;
  /** Haupttext – jeder Eintrag ist ein eigener Absatz */
  paragraphs: string[];
  /** CTA-Button-Text – nur bei medium und high gesetzt */
  ctaLabel?: string;
  /** CTA-URL */
  ctaUrl?: string;
  /** Signatur-Zeile */
  signature: string;
}

const CONTACT_URL = "https://zeeg.me/bsinzig/P00U26";

/**
 * Gibt den passenden Abschlusstext für das Gesamtbelastungsniveau zurück.
 */
export function buildClosingText(
  level: "low" | "medium" | "high",
  firstName: string
): ClosingText {
  const name = firstName?.trim() || "du";

  if (level === "low") {
    return {
      heading: "Ein Wort zum Abschluss",
      paragraphs: [
        `${name}, du hast diese zwei Wochen genutzt, um ehrlich hinzuschauen \u2013 das ist keine Selbstverst\u00e4ndlichkeit. Dein Ergebnis zeigt eine insgesamt niedrige Belastung. Das ist eine gute Nachricht, und gleichzeitig m\u00f6chte ich dir etwas mitgeben:`,
        `Burnout entsteht nicht \u00fcber Nacht. Er entsteht in den Momenten, in denen wir sagen: \u201eEs ist ja noch aushaltbar.\u201c Die F\u00e4higkeit, fr\u00fch zu erkennen, wo Energie verloren geht, ist eine der wertvollsten Kompetenzen, die du entwickeln kannst.`,
        `Nutze dieses Ergebnis als Orientierung \u2013 nicht als Entwarnung. Schau dir an, welche Bereiche auch bei niedriger Gesamtbelastung bereits gelb markiert sind. Dort liegt oft der Anfang einer Entwicklung, die sich noch steuern l\u00e4sst.`,
        `Ich w\u00fcnsche dir Klarheit, Energie und die Kraft, auf dich selbst zu h\u00f6ren.`,
      ],
      signature: "Bernd Sinzig\nBurnout LIFEBACK\u00ae Guide\u00a0|\u00a0Burnout- & Stresscoach",
    };
  }

  if (level === "medium") {
    return {
      heading: "Ein Wort zum Abschluss \u2013 und eine Einladung",
      paragraphs: [
        `${name}, dein Ergebnis zeigt eine deutliche Belastung. Das ist kein Alarm \u2013 aber es ist ein klares Signal, das ich ernst nehmen w\u00fcrde.`,
        `In meiner Arbeit mit Menschen, die sich in einer \u00e4hnlichen Situation befunden haben, erlebe ich immer wieder dasselbe Muster: Die Belastung ist sp\u00fcrbar, aber noch \u201eaushaltbar\u201c. Und genau deshalb wird gewartet. Gewartet, bis es sich von selbst l\u00f6st. Bis die n\u00e4chste Urlaubswoche Erholung bringt. Bis das Projekt abgeschlossen ist.`,
        `Manchmal l\u00f6st es sich. Meistens nicht.`,
        `Was ich dir anbiete, ist kein Coaching-Programm, das du kaufen musst. Es ist ein Gespr\u00e4ch. Ohne Agenda, ohne Verkauf. Nur die Frage: Wo stehst du wirklich \u2013 und was brauchst du jetzt?`,
        `\u201eDie meisten, die zu mir kommen, sagen: Ich h\u00e4tte fr\u00fcher kommen sollen. Nicht weil es dann leichter gewesen w\u00e4re, sondern weil sie Wochen, manchmal schon Monate verloren haben, in denen sie dachten, es wird schon von alleine.\u201c`,
      ],
      ctaLabel: "Lass uns sprechen \u2013 kostenloses Erstgespr\u00e4ch",
      ctaUrl: CONTACT_URL,
      signature: "Bernd Sinzig\nBurnout LIFEBACK\u00ae Guide\u00a0|\u00a0Burnout- & Stresscoach",
    };
  }

  // high
  return {
    heading: "Ein Wort zum Abschluss \u2013 direkt und ohne Umwege",
    paragraphs: [
      `${name}, ich sage dir das ohne Besch\u00f6nigung: Dein Ergebnis zeigt eine hohe Belastung. Das ist kein schlechter Tag und kein vor\u00fcbergehender Stress. Das ist ein Muster \u2013 und Muster verst\u00e4rken sich, wenn sie nicht unterbrochen werden.`,
      `Ich kenne diesen Zustand. Nicht aus B\u00fcchern. Ich habe selbst einen Burnout erlebt, war station\u00e4r in Therapie und musste den nicht einfachen Weg gehen. Was ich dabei gelernt habe, ist: Der Moment, in dem man Hilfe sucht, ist nie zu fr\u00fch \u2013 aber er kann zu sp\u00e4t sein.`,
      `Du hast jetzt ein klares Bild. Du wei\u00dft, wo die Belastung sitzt. Das ist mehr, als die meisten Menschen \u00fcber sich wissen.`,
      `Jetzt ist der Moment, dieses Wissen zu nutzen.`,
      `\u201eLass uns miteinander sprechen. Kein Verkaufsgespr\u00e4ch, nur Klarheit, wo du wirklich stehst. Die meisten, die zu mir kommen, sagen: Ich h\u00e4tte fr\u00fcher kommen sollen. Nicht weil es dann leichter gewesen w\u00e4re, sondern weil sie Wochen, manchmal schon Monate verloren haben, in denen sie dachten, es wird schon von alleine.\u201c`,
    ],
    ctaLabel: "Jetzt Kontakt aufnehmen \u2013 kostenloses Erstgespr\u00e4ch",
    ctaUrl: CONTACT_URL,
    signature: "Bernd Sinzig\nBurnout LIFEBACK\u00ae Guide\u00a0|\u00a0Burnout- & Stresscoach",
  };
}
