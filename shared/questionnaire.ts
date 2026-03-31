/**
 * Vollständiger Fragebogen: 8 Bereiche × 7 Fragen
 * Skala: 0 = nie, 1 = selten, 2 = oft, 3 = immer
 */

export const ANSWER_LABELS = ["nein", "ein wenig", "halb und halb", "wie nicht geschlafen"] as const;

export interface QuestionArea {
  id: number;
  title: string;
  intro: string;
  questions: string[];
}

export const QUESTIONNAIRE_AREAS: QuestionArea[] = [
  {
    id: 1,
    title: "Schlaf",
    intro:
      "Es gibt Nächte, in denen du im Bett liegst und dein Körper müde ist, aber dein Kopf einfach weitermacht. Du wachst auf und fühlst dich, als hättest du gar nicht wirklich geschlafen. Tagsüber rettest du dich mit Kaffee oder Snacks über die Runden – und hoffst jeden Abend, dass es diesmal besser wird.",
    questions: [
      "Bist du heute erschöpft aufgewacht, obwohl du eigentlich genug geschlafen hast?",
      "Hast du Schwierigkeiten einzuschlafen, weil deine Gedanken kreisen?",
      "Wachst du nachts auf und grübelst über die Arbeit oder Probleme?",
      "Brauchst du tagsüber Koffein, um überhaupt funktionieren zu können?",
      "Denkst du öfter: Ich würde so gerne mal wieder richtig durchschlafen.",
      "Schaust du abends lange auf Bildschirme (Handy, Laptop, TV), obwohl du weißt, dass es deinen Schlaf stört?",
      "Verschiebst du bewusst deinen Schlaf (z. B. noch eine Folge, noch schnell etwas fertig machen), obwohl du müde bist?",
    ],
  },
  {
    id: 2,
    title: "Energie & Leistungskraft",
    intro:
      "Du stehst morgens auf und der Tag wirkt wie ein Berg, bevor er überhaupt begonnen hat. Du funktionierst, du machst weiter, du reißt dich zusammen – und trotzdem fühlt es sich an, als würdest du permanent hinter dir selbst herlaufen. Vielleicht merkst du: Deine Disziplin ist hoch, aber deine Energie ist im Keller.",
    questions: [
      "Fühlst du dich schon morgens energielos, bevor der Tag richtig begonnen hat?",
      "Brauchst du mittags Koffein oder einen Powernap, um weiterzumachen?",
      "Fühlst du dich abends komplett ausgelaugt, auch nach normalen Tagen?",
      "Schiebst du Aufgaben vor dir her, weil dir die Energie fehlt, sie anzupacken?",
      "Denkst du häufiger: Ich kann nicht mehr – ich laufe nur noch auf Reserve.",
      "Hast du das Gefühl, du funktionierst nur noch, anstatt deinen Tag aktiv zu gestalten?",
      "Hast du das Gefühl, selbst nach freien Tagen oder Urlaub nicht wirklich erholt zu sein?",
    ],
  },
  {
    id: 3,
    title: "Nervensystem & Gefühle",
    intro:
      "Kleinigkeiten bringen dich aus der Fassung: eine Mail, ein Kommentar, ein kleines Missverständnis. Du merkst, dass du schneller gereizt bist, dünnhäutiger, näher an Tränen oder Explosion als früher. Abends liegst du auf dem Sofa und willst einfach nur Ruhe, aber in dir drin läuft alles weiter.",
    questions: [
      "Reagierst du gereizt auf Dinge, die dich früher kaum gestört haben?",
      "Fällt es dir schwer, abends innerlich zur Ruhe zu kommen und abzuschalten?",
      "Fühlst du dich innerlich leer oder emotional abgestumpft?",
      "Hast du oft das Gefühl, dass dir alles zu viel wird?",
      "Bist du häufiger nah am Weinen, ohne genau sagen zu können, warum?",
      "Hast du das Gefühl, ständig unter Strom zu stehen, selbst in Pausen?",
      "Zählst du innerlich die Tage bis zum Wochenende oder Urlaub, um endlich zu entkommen?",
    ],
  },
  {
    id: 4,
    title: "Konzentration & mentale Leistungskraft",
    intro:
      "Früher konntest du dich hinsetzen, loslegen und Dinge einfach erledigen. Heute merkst du: Du springst zwischen Aufgaben hin und her, liest dieselbe Zeile mehrfach und machst Fehler, die dir sonst nicht passiert wären. Entscheidungen fühlen sich schwer an – sogar bei Dingen, die früher nebenbei gingen.",
    questions: [
      "Fällt es dir schwer, dich längere Zeit auf eine Aufgabe zu konzentrieren?",
      "Machst du häufiger Fehler, die dir früher nicht passiert wären?",
      "Vergisst du Termine, Namen oder Aufgaben, obwohl du sie dir vorgenommen hattest?",
      "Fällt es dir schwer, Entscheidungen zu treffen, selbst bei einfachen Dingen?",
      "Fühlst du dich mental vernebelt, als wäre dein Kopf nicht ganz klar?",
      "Hast du das Gefühl, ständig zwischen Aufgaben hin- und herzuschalten, ohne etwas fertig zu bekommen?",
      "Liest du Texte oder E-Mails mehrfach, weil du sie beim ersten Mal nicht richtig aufgenommen hast?",
    ],
  },
  {
    id: 5,
    title: "Körperliche Stresssignale",
    intro:
      "Dein Körper meldet sich – mit Kopfschmerzen, einem verkrampften Nacken, Magenziehen oder ständiger Müdigkeit. Vielleicht sagst du dir: Das ist halt so oder Dafür habe ich jetzt keine Zeit. Gleichzeitig spürst du, dass dein Körper längst Stopp sagt, während dein Kopf noch auf weiter, weiter besteht.",
    questions: [
      "Hast du regelmäßig Kopfschmerzen, Rückenschmerzen oder starke Verspannungen?",
      "Hast du öfter Magen-Darm-Beschwerden (z. B. Druck im Magen, Übelkeit, Durchfall, Verstopfung)?",
      "Bist du häufig krank – z. B. Erkältungen oder Infekte, die lange nicht weggehen?",
      "Ignorierst du körperliche Warnsignale, weil du keine Zeit hast, dich darum zu kümmern?",
      "Nimmst du Schmerzmittel oder andere Mittel, um weitermachen zu können?",
      "Fühlst du dich körperlich oft angespannt, z. B. Kiefer verkrampft, Schultern hochgezogen?",
      "Hast du das Gefühl, dein Körper ist ständig müde, auch wenn du funktionierst?",
    ],
  },
  {
    id: 6,
    title: "Soziale Verbindung & Rückzug",
    intro:
      "Nach einem langen Tag hast du eigentlich Menschen, die dir wichtig sind – aber du sagst Treffen ab, weil du keine Energie mehr übrig hast. Du bist unter Leuten und fühlst dich trotzdem allein. Gespräche strengen dich an, und manchmal denkst du: Ich will einfach meine Ruhe – nichts und niemand.",
    questions: [
      "Sagst du Treffen mit Freunden oder Familie ab, weil du keine Energie hast?",
      "Fühlst du dich einsam, selbst wenn andere Menschen um dich herum sind?",
      "Hast du oft das Gefühl, niemand versteht, wie es dir wirklich geht?",
      "Vermeidest du soziale Kontakte oder Meetings, weil sie sich anstrengend anfühlen?",
      "Denkst du häufiger: Ich will einfach nur meine Ruhe und allein sein.",
      "Öffnest du dich kaum noch anderen, weil du niemanden belasten willst?",
      "Hast du das Gefühl, dich innerlich von wichtigen Menschen zu entfernen?",
    ],
  },
  {
    id: 7,
    title: "Sinn & Freude",
    intro:
      "Du machst, was du immer gemacht hast – arbeitest, leistest, funktionierst. Aber das Gefühl dahinter hat sich verändert. Erfolge fühlen sich flach an, Aufgaben werden zu To-dos, nicht zu etwas, das dich innerlich berührt. Immer öfter taucht der Gedanke auf: Wofür mache ich das alles eigentlich noch?",
    questions: [
      "Fühlst du dich leer, wenn du etwas erreichst, das dich früher gefreut hätte?",
      "Fragst du dich: Wofür mache ich das alles überhaupt?",
      "Hast du das Gefühl, deine Arbeit hat wenig oder keine Bedeutung mehr?",
      "Machst du deinen Job überwiegend nur noch funktional, um ihn hinter dich zu bringen?",
      "Denkst du öfter: Ich weiß nicht, wie lange ich das noch durchhalte.",
      "Hast du das Interesse an Hobbys verloren, die dir früher Freude gemacht haben?",
      "Fühlt sich dein Alltag mehr nach Überleben als nach Leben an?",
    ],
  },
  {
    id: 8,
    title: "Innere Distanz zu anderen",
    intro:
      "Du merkst, dass du innerlich zumachst. Menschen, mit denen du arbeitest oder lebst, fühlen sich eher wie Anforderungen an als wie echte Begegnungen. Du bist freundlich, professionell, funktionierend – aber innerlich ziehst du dich zurück. Manchmal erschreckt dich der Gedanke: Ich werde immer kälter – und gleichzeitig weißt du, dass du einfach nicht mehr viel zu geben hast.",
    questions: [
      "Hast du das Gefühl, dass dir andere Menschen egal werden, obwohl dir Beziehungen früher wichtig waren?",
      "Erledigst du deine Arbeit mit Menschen (Kund:innen, Klient:innen, Kolleg:innen) eher wie Fälle oder To-dos als wie echte Begegnungen?",
      "Denkst du manchmal abwertend über Menschen, die etwas von dir wollen (z. B. Die nerven mich alle nur noch)?",
      "Fühlst du dich innerlich wie hinter einer Glasscheibe, wenn du mit anderen in Kontakt bist?",
      "Tust du freundlich nach außen, fühlst dich innerlich aber kalt, genervt oder völlig leer?",
      "Hast du das Gefühl, du spielst nur noch eine Rolle (z. B. die/der Funktionierende, die/der Professionelle), statt wirklich du selbst zu sein?",
      "Ziehst du dich emotional zurück, um nicht noch mehr geben zu müssen – auch bei Menschen, die dir eigentlich wichtig sind?",
    ],
  },
];

/** Schwellenwerte für einzelne Bereiche (0–21) */
export const AREA_THRESHOLDS = {
  GREEN: { max: 6.9, label: "gering", color: "green" },
  YELLOW: { min: 7.0, max: 13.9, label: "deutlich", color: "yellow" },
  RED: { min: 14.0, label: "stark", color: "red" },
} as const;

/** Schwellenwerte für den Gesamtscore (0–168) */
export const TOTAL_THRESHOLDS = {
  LOW: { max: 56, label: "niedrig/mild" },
  MEDIUM: { min: 57, max: 112, label: "deutlich" },
  HIGH: { min: 113, label: "hoch" },
} as const;

export function getAreaLevel(avg: number): "green" | "yellow" | "red" {
  if (avg <= 6.9) return "green";
  if (avg <= 13.9) return "yellow";
  return "red";
}

export function getTotalLevel(total: number): "low" | "medium" | "high" {
  if (total <= 56) return "low";
  if (total <= 112) return "medium";
  return "high";
}

/** Bereichsspezifische Auswertungstexte für jeden Schwellenwert */
export const AREA_TEXTS: Record<number, { green: string; yellow: string; red: string }> = {
  1: {
    green:
      "Dein Schlaf scheint derzeit ausreichend erholsam zu sein. Du zeigst wenige Anzeichen von schlafbezogener Erschöpfung. Das ist eine gute Grundlage für deine Regeneration.",
    yellow:
      "Dein Schlaf sendet erste Warnsignale. Du erholst dich nicht vollständig, und das macht sich im Alltag bemerkbar. Es lohnt sich, deine Schlafgewohnheiten genauer zu betrachten.",
    red: "Dein Schlaf ist stark beeinträchtigt. Die Erschöpfung, die du morgens fühlst, ist ein deutliches Zeichen, dass dein Körper und Geist dringend Erholung brauchen. Dieser Bereich verdient sofortige Aufmerksamkeit.",
  },
  2: {
    green:
      "Deine Energie und Leistungsfähigkeit sind derzeit stabil. Du kannst deinen Alltag aktiv gestalten, ohne auf Reserve zu laufen.",
    yellow:
      "Deine Energie zeigt Lücken. Du funktionierst noch, aber das Gefühl, hinter dir selbst herzulaufen, ist ein Zeichen, dass deine Ressourcen nicht ausreichen.",
    red: "Deine Energiereserven sind kritisch niedrig. Du läufst auf Reserve – und das über einen längeren Zeitraum. Dein Körper und Geist brauchen dringend Entlastung und Erholung.",
  },
  3: {
    green:
      "Dein Nervensystem zeigt sich derzeit stabil. Du kannst Stress regulieren und abends abschalten. Das ist ein wichtiges Zeichen von Resilienz.",
    yellow:
      "Dein Nervensystem steht unter Druck. Die Reizbarkeit, das Gefühl, ständig unter Strom zu stehen – das sind Zeichen, dass dein System Unterstützung braucht.",
    red: "Dein Nervensystem ist dauerhaft überlastet. Die emotionale Erschöpfung und das Gefühl, nicht abschalten zu können, sind ernsthafte Warnsignale. Hier ist professionelle Unterstützung sinnvoll.",
  },
  4: {
    green:
      "Deine kognitive Leistungsfähigkeit ist derzeit gut. Du kannst dich konzentrieren, Entscheidungen treffen und Aufgaben erledigen.",
    yellow:
      "Deine mentale Kapazität zeigt erste Einschränkungen. Die Konzentrationsschwierigkeiten und das Gefühl des mentalen Nebels sind Zeichen von Überlastung.",
    red: "Deine kognitive Leistungsfähigkeit ist stark beeinträchtigt. Der mentale Nebel, die Entscheidungsschwäche und die Fehleranfälligkeit zeigen, dass dein Gehirn dringend Erholung braucht.",
  },
  5: {
    green:
      "Dein Körper sendet derzeit wenige Stresssignale. Du bist körperlich weitgehend in Balance.",
    yellow:
      "Dein Körper meldet sich mit Stresssignalen. Verspannungen, Kopfschmerzen oder Magenprobleme sind keine Kleinigkeiten – sie sind Botschaften deines Körpers.",
    red: "Dein Körper ist im Dauerstress. Die körperlichen Symptome, die du erlebst, sind ernsthafte Warnsignale. Dein Körper sagt Stopp – es ist Zeit, zuzuhören.",
  },
  6: {
    green:
      "Deine sozialen Verbindungen sind derzeit stabil. Du kannst Nähe zulassen und dich auf andere einlassen.",
    yellow:
      "Du ziehst dich sozial zurück. Das Absagen von Treffen, das Gefühl der Einsamkeit trotz Gesellschaft – das sind Zeichen, dass deine sozialen Ressourcen erschöpft sind.",
    red: "Deine soziale Isolation ist ausgeprägt. Der Rückzug von Menschen, die dir wichtig sind, ist ein starkes Warnsignal. Isolation verstärkt Erschöpfung – hier ist Verbindung wichtig.",
  },
  7: {
    green:
      "Du erlebst derzeit Sinn und Freude in deinem Alltag. Das ist eine wichtige Schutzressource.",
    yellow:
      "Sinn und Freude verblassen. Das Gefühl, nur noch zu funktionieren, und die Frage Wofür mache ich das? sind frühe Zeichen von Burnout.",
    red: "Du hast den Zugang zu Sinn und Freude weitgehend verloren. Das ist eines der zentralen Merkmale von Burnout. Professionelle Unterstützung kann helfen, diesen Zugang wiederzufinden.",
  },
  8: {
    green:
      "Du kannst echte Verbindungen zu anderen Menschen aufrechterhalten. Deine emotionale Präsenz ist ein wichtiges Zeichen von Gesundheit.",
    yellow:
      "Du spürst eine wachsende innere Distanz zu anderen. Das Gefühl, nur noch Rollen zu spielen, ist ein Zeichen emotionaler Erschöpfung.",
    red: "Die innere Distanz zu anderen ist stark ausgeprägt. Das Gefühl der emotionalen Kälte und des Rückzugs ist ein zentrales Burnout-Symptom. Hier ist professionelle Begleitung wichtig.",
  },
};

/** Musterbeschreibungen mit nutzerfreundlichem Titel und Erklärung */
export interface PatternInfo {
  title: string;       // Kurze, verständliche Bezeichnung
  subtitle: string;    // Ergänzender Kontext in einem Satz
  description: string; // Ausführliche Erklärung für den User
  severity: "warning" | "critical"; // Schweregrad für visuelle Hervorhebung
}

export const PATTERN_INFO: Record<string, PatternInfo> = {
  A1: {
    title: "Dein Körper läuft auf dem letzten Reserve",
    subtitle: "Schlaf, Energie und Nervensystem sind gleichzeitig stark belastet.",
    description:
      "Wenn Schlaf, Energie und emotionale Stabilität gleichzeitig zusammenbrechen, befindet sich dein gesamtes System im Überlebensmodus. Du funktionierst noch – aber dein Körper und Geist zahlen dafür einen hohen Preis. Dieses Muster ist ein ernstes Warnsignal für ein tiefes Erschöpfungssyndrom. Professionelle Unterstützung ist dringend empfohlen.",
    severity: "critical",
  },
  A2: {
    title: "Dein Körper sendet deutliche Stresssignale",
    subtitle: "Mindestens zwei deiner körperlichen Grundbereiche sind stark belastet.",
    description:
      "Schlaf, Energie oder Nervensystem – wenn zwei dieser Grundpfeiler gleichzeitig wackeln, kämpft dein Körper gegen die Erschöpfung an. Du merkst es vielleicht daran, dass du dich auch nach Ruhe nicht wirklich erholt fühlst. Ohne gezielte Entlastung droht eine Verschlechterung.",
    severity: "warning",
  },
  B1: {
    title: "Du hast den Zugang zu Freude und echten Verbindungen verloren",
    subtitle: "Sinnverlust und innere Distanz zu anderen Menschen sind stark ausgeprägt.",
    description:
      "Wenn Arbeit sich nur noch nach Pflicht anfühlt und Menschen sich wie Anforderungen statt wie echte Begegnungen anfühlen, ist das ein klassisches Bild von fortgeschrittenem Burnout. Fachleute nennen das emotionale Erschöpfung kombiniert mit Depersonalisierung. Du bist nicht kaputt – aber du brauchst jetzt Unterstützung, um den Weg zurück zu finden.",
    severity: "critical",
  },
  B2: {
    title: "Freude und Verbindung beginnen zu verblassen",
    subtitle: "Erste Zeichen von Sinnverlust und emotionalem Rückzug sind erkennbar.",
    description:
      "Die Frage \u201eWofür mache ich das eigentlich noch?\u201c und das Gefühl, innerlich etwas auf Abstand zu halten – das sind frühe, aber wichtige Signale. Diese Signale zeigen, dass deine emotionalen Ressourcen zur Neige gehen. Jetzt ist ein guter Zeitpunkt, gegenzusteuern, bevor diese Muster tiefer werden.",
    severity: "warning",
  },
  C: {
    title: "Dein Kopf und dein Körper sind gleichzeitig überlastet",
    subtitle: "Mentaler Nebel und körperliche Stresssignale treten gemeinsam auf.",
    description:
      "Wenn du gleichzeitig Konzentrationsprobleme hast und dein Körper mit Verspannungen, Kopfschmerzen oder Magenprobleme reagiert, zeigt das: Die Belastung ist nicht nur im Kopf. Dein gesamtes System – Gehirn und Körper – ist überlastet. Dieses Muster braucht Entlastung auf beiden Ebenen.",
    severity: "warning",
  },
  D: {
    title: "Du hast dich in den Rückzug geflüchtet",
    subtitle: "Sozialer und emotionaler Rückzug als Schutzmechanismus.",
    description:
      "Wenn du dich sowohl von Menschen als auch innerlich stark zurückziehst, ist das kein Versagen – es ist ein Schutzmechanismus deines überlasteten Systems. Doch langfristig verstärkt Isolation die Erschöpfung. Kleine Schritte zurück in echte Verbindung können hier einen großen Unterschied machen.",
    severity: "warning",
  },
  E1: {
    title: "Fast alle Lebensbereiche sind stark belastet",
    subtitle: "6 oder mehr Bereiche zeigen kritische Werte – ein umfassendes Erschöpfungssyndrom.",
    description:
      "Wenn nahezu alle Bereiche deines Lebens – Schlaf, Energie, Gefühle, Konzentration, Körper, soziale Verbindungen, Sinn und Beziehungen – gleichzeitig stark belastet sind, ist das ein klares Zeichen für ein umfassendes Erschöpfungssyndrom. Bitte such dir jetzt professionelle Unterstützung. Du musst das nicht alleine tragen.",
    severity: "critical",
  },
  E2: {
    title: "Mehrere Lebensbereiche sind gleichzeitig betroffen",
    subtitle: "4 bis 5 Bereiche zeigen kritische Werte – die Erschöpfung ist systemisch.",
    description:
      "Wenn vier oder fünf Bereiche deines Lebens gleichzeitig stark belastet sind, ist das kein Zufall und kein persönliches Versagen. Es zeigt, dass die Erschöpfung dein gesamtes System erfasst hat – nicht nur einzelne Bereiche. Jetzt ist der richtige Zeitpunkt, aktiv gegenzusteuern.",
    severity: "warning",
  },
  F: {
    title: "Du kompensierst – aber die Warnsignale sind da",
    subtitle: "Trotz mittlerer Gesamtbelastung zeigen mehrere Bereiche kritische Werte.",
    description:
      "Deine Gesamtbelastung wirkt auf den ersten Blick moderat – aber einzelne Bereiche zeigen bereits kritische Werte. Das ist oft ein Zeichen dafür, dass du die Belastung durch große Anstrengung kompensierst. Das funktioniert eine Weile, aber nicht dauerhaft. Die Warnsignale sollten ernst genommen werden, bevor die Kompensation zusammenbricht.",
    severity: "warning",
  },
};

/** Rückwärtskompatibilität: einfacher String-Zugriff */
export const PATTERN_TEXTS: Record<string, string> = Object.fromEntries(
  Object.entries(PATTERN_INFO).map(([k, v]) => [k, `${v.title}: ${v.description}`])
);

/** Globale Auswertungstexte */
export const GLOBAL_TEXTS = {
  low: "Deine Gesamtbelastung ist derzeit gering bis mild. Du zeigst wenige Anzeichen von Erschöpfung. Nutze diese Phase, um präventiv auf deine Ressourcen zu achten.",
  medium:
    "Deine Gesamtbelastung ist deutlich erhöht. Mehrere Bereiche deines Lebens sind betroffen. Es ist wichtig, jetzt aktiv Maßnahmen zu ergreifen, bevor die Erschöpfung zunimmt.",
  high: "Deine Gesamtbelastung ist hoch. Du befindest dich in einem Zustand erheblicher Erschöpfung. Professionelle Unterstützung – durch einen Coach, Therapeuten oder Arzt – ist dringend empfohlen.",
};

/** Belastungsmuster aus Bereichsdurchschnitten berechnen */
export function computePatterns(avgs: number[]): string[] {
  const patterns: string[] = [];
  const [a1, a2, a3, a4, a5, a6, a7, a8] = avgs;
  const highCount = avgs.filter((v) => v >= 14).length;
  const totalSum = avgs.reduce((s, v) => s + v, 0);

  // Muster A: Körper & Nervensystem
  if (a1 >= 14 && a2 >= 14 && a3 >= 14) {
    patterns.push("A1");
  } else if ([a1, a2, a3].filter((v) => v >= 14).length >= 2) {
    patterns.push("A2");
  }

  // Muster B: Sinnverlust & innere Distanz
  if (a7 >= 14 && a8 >= 14) {
    patterns.push("B1");
  } else if (a7 >= 7 && a8 >= 7 && (a7 >= 14 || a8 >= 14)) {
    patterns.push("B2");
  }

  // Muster C: Kognitiv-körperliche Überlastung
  if (a4 >= 14 && a5 >= 14) {
    patterns.push("C");
  }

  // Muster D: Soziale Isolation
  if (a6 >= 14 && a8 >= 14) {
    patterns.push("D");
  }

  // Muster E: Mehrfachbelastung
  if (highCount >= 6) {
    patterns.push("E1");
  } else if (highCount >= 4) {
    patterns.push("E2");
  }

  // Muster F: Verdeckte Hochbelastung
  if (totalSum >= 57 && totalSum <= 112 && highCount >= 2) {
    patterns.push("F");
  }

  return patterns;
}
