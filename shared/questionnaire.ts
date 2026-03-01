/**
 * Complete questionnaire data: 8 areas x 7 questions
 * Scale: 0 = nie, 1 = selten, 2 = oft, 3 = immer
 */

export const ANSWER_LABELS = ["nie", "selten", "oft", "immer"] as const;

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
      "Es gibt Naechte, in denen du im Bett liegst und dein Koerper muede ist, aber dein Kopf einfach weitermacht. Du wachst auf und fuehlst dich, als haettest du gar nicht wirklich geschlafen. Tagsüber rettest du dich mit Kaffee, Scrollen oder Snacks ueber die Runden - und hoffst jeden Abend, dass es diesmal besser wird.",
    questions: [
      "Wachst du morgens erschoepft auf, obwohl du eigentlich genug geschlafen hast?",
      "Hast du Schwierigkeiten einzuschlafen, weil deine Gedanken kreisen?",
      "Wachst du nachts auf und gruebelst ueber die Arbeit oder Probleme?",
      "Brauchst du tagsüber Koffein, um ueberhaupt funktionieren zu koennen?",
      "Denkst du oefter: Ich wuerde so gerne mal wieder richtig durchschlafen.",
      "Schaust du abends lange auf Bildschirme (Handy, Laptop, TV), obwohl du weisst, dass es deinen Schlaf stoert?",
      "Verschiebst du bewusst Schlaf (z.B. noch eine Folge, noch schnell etwas fertig machen), obwohl du muede bist?",
    ],
  },
  {
    id: 2,
    title: "Energie & Leistungskraft",
    intro:
      "Du stehst morgens auf und der Tag wirkt wie ein Berg, bevor er ueberhaupt begonnen hat. Du funktionierst, du machst weiter, du reisst dich zusammen - und trotzdem fuehlt es sich an, als wuerdest du permanent hinter dir selbst herlaufen. Vielleicht merkst du: Deine Disziplin ist hoch, aber deine Energie ist im Keller.",
    questions: [
      "Fuehlst du dich schon morgens energielos, bevor der Tag richtig begonnen hat?",
      "Brauchst du mittags Koffein oder einen Powernap, um weiterzumachen?",
      "Fuehlst du dich abends komplett ausgelaugt, auch nach normalen Tagen?",
      "Schiebst du Aufgaben vor dir her, weil dir die Energie fehlt, sie anzupacken?",
      "Denkst du haeufiger: Ich kann nicht mehr - ich laufe nur noch auf Reserve.",
      "Hast du das Gefuehl, du funktionierst nur noch, anstatt deinen Tag aktiv zu gestalten?",
      "Hast du das Gefuehl, selbst nach freien Tagen oder Urlaub nicht wirklich erholt zu sein?",
    ],
  },
  {
    id: 3,
    title: "Nervensystem & Gefühle",
    intro:
      "Kleinigkeiten bringen dich aus der Fassung: eine Mail, ein Kommentar, ein kleines Missverstaendnis. Du merkst, dass du schneller gereizt bist, duennhaeuter, naeher an Traenen oder Explosion als frueher. Abends liegst du auf dem Sofa und willst einfach nur Ruhe, aber in dir drin laeuft alles weiter.",
    questions: [
      "Reagierst du gereizt auf Dinge, die dich frueher kaum gestoert haben?",
      "Faellt es dir schwer, abends innerlich zur Ruhe zu kommen und abzuschalten?",
      "Fuehlst du dich innerlich leer oder emotional abgestumpft?",
      "Hast du oft das Gefuehl, dass dir alles zu viel wird?",
      "Bist du haeufiger nah am Weinen, ohne genau sagen zu koennen, warum?",
      "Hast du das Gefuehl, staendig unter Strom zu stehen, selbst in Pausen?",
      "Zaehlst du innerlich die Tage bis zum Wochenende oder Urlaub, um endlich zu entkommen?",
    ],
  },
  {
    id: 4,
    title: "Konzentration & mentale Leistungskraft",
    intro:
      "Frueher konntest du dich hinsetzen, loslegen und Dinge einfach erledigen. Heute merkst du: Du springst zwischen Aufgaben hin und her, liest dieselbe Zeile mehrfach und machst Fehler, die dir sonst nicht passiert waeren. Entscheidungen fuehlen sich schwer an - sogar bei Dingen, die frueher nebenbei gingen.",
    questions: [
      "Faellt es dir schwer, dich laengere Zeit auf eine Aufgabe zu konzentrieren?",
      "Machst du haeufiger Fehler, die dir frueher nicht passiert waeren?",
      "Vergisst du Termine, Namen oder Aufgaben, obwohl du sie dir vorgenommen hattest?",
      "Faellt es dir schwer, Entscheidungen zu treffen, selbst bei einfachen Dingen?",
      "Fuehlst du dich mental vernebelt, als waere dein Kopf nicht ganz klar?",
      "Hast du das Gefuehl, staendig zwischen Aufgaben hin- und herzuschalten, ohne etwas fertig zu bekommen?",
      "Liest du Texte oder E-Mails mehrfach, weil du sie beim ersten Mal nicht richtig aufgenommen hast?",
    ],
  },
  {
    id: 5,
    title: "Körperliche Stresssignale",
    intro:
      "Dein Koerper meldet sich - mit Kopfschmerzen, einem verkrampften Nacken, Magenziehen oder staendiger Muedigkeit. Vielleicht sagst du dir: Das ist halt so oder Dafuer habe ich jetzt keine Zeit. Gleichzeitig spuerst du, dass dein Koerper laengst Stopp sagt, waehrend dein Kopf noch auf weiter, weiter besteht.",
    questions: [
      "Hast du regelmaessig Kopfschmerzen, Rueckenschmerzen oder starke Verspannungen?",
      "Hast du oefter Magen-Darm-Beschwerden (z.B. Druck im Magen, Uebelkeit, Durchfall, Verstopfung)?",
      "Bist du haeufig krank - z.B. Erkaeltungen, Infekte, die lange nicht weggehen?",
      "Ignorierst du koerperliche Warnsignale, weil du keine Zeit hast, dich darum zu kuemmern?",
      "Nimmst du Schmerzmittel oder andere Mittel, um weitermachen zu koennen?",
      "Fuehlst du dich koerperlich oft angespannt, z.B. Kiefer verkrampft, Schultern hochgezogen?",
      "Hast du das Gefuehl, dein Koerper ist staendig muede, auch wenn du funktionierst?",
    ],
  },
  {
    id: 6,
    title: "Soziale Verbindung & Rückzug",
    intro:
      "Nach einem langen Tag hast du eigentlich Menschen, die dir wichtig sind - aber du sagst Treffen ab, weil du keine Energie mehr uebrig hast. Du bist unter Leuten und fuehlst dich trotzdem allein. Gespraeche strengen dich an, und manchmal denkst du: Ich will einfach meine Ruhe - nichts und niemand.",
    questions: [
      "Sagst du Treffen mit Freunden oder Familie ab, weil du keine Energie hast?",
      "Fuehlst du dich einsam, selbst wenn andere Menschen um dich herum sind?",
      "Hast du oft das Gefuehl, niemand versteht, wie es dir wirklich geht?",
      "Vermeidest du soziale Kontakte oder Meetings, weil sie sich anstrengend anfuehlen?",
      "Denkst du haeufiger: Ich will einfach nur meine Ruhe und allein sein.",
      "Oeffnest du dich kaum noch anderen, weil du niemanden belasten willst?",
      "Hast du das Gefuehl, dich innerlich von wichtigen Menschen zu entfernen?",
    ],
  },
  {
    id: 7,
    title: "Sinn & Freude",
    intro:
      "Du machst, was du immer gemacht hast - arbeitest, leistest, funktionierst. Aber das Gefuehl dahinter hat sich veraendert. Erfolge fuehlen sich flach an, Aufgaben werden zu To-dos, nicht zu etwas, das dich innerlich beruehrt. Immer oefter taucht der Gedanke auf: Wofuer mache ich das alles eigentlich noch?",
    questions: [
      "Fuehlst du dich leer, wenn du etwas erreichst, das dich frueher gefreut haette?",
      "Fragst du dich: Wofuer mache ich das alles ueberhaupt?",
      "Hast du das Gefuehl, deine Arbeit hat wenig oder keine Bedeutung mehr?",
      "Machst du deinen Job ueberwiegend nur noch funktional, um ihn hinter dich zu bringen?",
      "Denkst du oefter: Ich weiss nicht, wie lange ich das noch durchhalte.",
      "Hast du das Interesse an Hobbys verloren, die dir frueher Freude gemacht haben?",
      "Fuehlt sich dein Alltag mehr nach Ueberleben als nach Leben an?",
    ],
  },
  {
    id: 8,
    title: "Innere Distanz zu anderen",
    intro:
      "Du merkst, dass du innerlich zumachst. Menschen, mit denen du arbeitest oder lebst, fuehlen sich eher wie Anforderungen an als wie echte Begegnungen. Du bist freundlich, professionell, funktionierend - aber innerlich ziehst du dich zurueck. Manchmal erschreckt dich der Gedanke: Ich werde immer kaelter - und gleichzeitig weisst du, dass du einfach nicht mehr viel zu geben hast.",
    questions: [
      "Hast du das Gefuehl, dass dir andere Menschen egal werden, obwohl dir Beziehungen frueher wichtig waren?",
      "Erledigst du deine Arbeit mit Menschen (Kund:innen, Klient:innen, Kolleg:innen) eher wie Faelle oder To-dos als wie echte Begegnungen?",
      "Denkst du manchmal abwertend ueber Menschen, die etwas von dir wollen (z.B. Die nerven mich alle nur noch)?",
      "Fuehlst du dich innerlich wie hinter einer Glasscheibe, wenn du mit anderen in Kontakt bist?",
      "Tust du freundlich nach aussen, fuehlst dich innerlich aber kalt, genervt oder voellig leer?",
      "Hast du das Gefuehl, du spielst nur noch eine Rolle (z.B. die/der Funktionierende, die/der Professionelle), statt wirklich du selbst zu sein?",
      "Ziehst du dich emotional zurueck, um nicht noch mehr geben zu muessen - auch bei Menschen, die dir eigentlich wichtig sind?",
    ],
  },
];

/** Thresholds for individual areas (0-21) */
export const AREA_THRESHOLDS = {
  GREEN: { max: 6.9, label: "gering", color: "green" },
  YELLOW: { min: 7.0, max: 13.9, label: "deutlich", color: "yellow" },
  RED: { min: 14.0, label: "stark", color: "red" },
} as const;

/** Thresholds for total score (0-168) */
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

/** Area evaluation texts for each threshold level */
export const AREA_TEXTS: Record<number, { green: string; yellow: string; red: string }> = {
  1: {
    green:
      "Dein Schlaf scheint derzeit ausreichend erholsam zu sein. Du zeigst wenige Anzeichen von schlafbezogener Erschoepfung. Das ist eine gute Grundlage fuer deine Regeneration.",
    yellow:
      "Dein Schlaf sendet erste Warnsignale. Du erholst dich nicht vollstaendig, und das macht sich im Alltag bemerkbar. Es lohnt sich, deine Schlafgewohnheiten genauer zu betrachten.",
    red: "Dein Schlaf ist stark beeintraechtigt. Die Erschoepfung, die du morgens fuehlst, ist ein deutliches Zeichen, dass dein Koerper und Geist dringend Erholung brauchen. Dieser Bereich verdient sofortige Aufmerksamkeit.",
  },
  2: {
    green:
      "Deine Energie und Leistungsfaehigkeit sind derzeit stabil. Du kannst deinen Alltag aktiv gestalten, ohne auf Reserve zu laufen.",
    yellow:
      "Deine Energie zeigt Luecken. Du funktionierst noch, aber das Gefuehl, hinter dir selbst herzulaufen, ist ein Zeichen, dass deine Ressourcen nicht ausreichen.",
    red: "Deine Energiereserven sind kritisch niedrig. Du laeufst auf Reserve - und das ueber einen laengeren Zeitraum. Dein Koerper und Geist brauchen dringend Entlastung und Erholung.",
  },
  3: {
    green:
      "Dein Nervensystem zeigt sich derzeit stabil. Du kannst Stress regulieren und abends abschalten. Das ist ein wichtiges Zeichen von Resilienz.",
    yellow:
      "Dein Nervensystem steht unter Druck. Die Reizbarkeit, das Gefuehl staendig unter Strom zu stehen - das sind Zeichen, dass dein System Unterstuetzung braucht.",
    red: "Dein Nervensystem ist dauerhaft ueberlastet. Die emotionale Erschoepfung und das Gefuehl, nicht abschalten zu koennen, sind ernsthafte Warnsignale. Hier ist professionelle Unterstuetzung sinnvoll.",
  },
  4: {
    green:
      "Deine kognitive Leistungsfaehigkeit ist derzeit gut. Du kannst dich konzentrieren, Entscheidungen treffen und Aufgaben erledigen.",
    yellow:
      "Deine mentale Kapazitaet zeigt erste Einschraenkungen. Die Konzentrationsschwierigkeiten und das Gefuehl des mentalen Nebels sind Zeichen von Ueberlastung.",
    red: "Deine kognitive Leistungsfaehigkeit ist stark beeintraechtigt. Der mentale Nebel, die Entscheidungsschwaeche und die Fehleranfaelligkeit zeigen, dass dein Gehirn dringend Erholung braucht.",
  },
  5: {
    green:
      "Dein Koerper sendet derzeit wenige Stresssignale. Du bist koerperlich weitgehend in Balance.",
    yellow:
      "Dein Koerper meldet sich mit Stresssignalen. Verspannungen, Kopfschmerzen oder Magenprobleme sind keine Kleinigkeiten - sie sind Botschaften deines Koerpers.",
    red: "Dein Koerper ist im Dauerstress. Die koerperlichen Symptome, die du erlebst, sind ernsthafte Warnsignale. Dein Koerper sagt Stopp - es ist Zeit, zuzuhoeren.",
  },
  6: {
    green:
      "Deine sozialen Verbindungen sind derzeit stabil. Du kannst Naehe zulassen und dich auf andere einlassen.",
    yellow:
      "Du ziehst dich sozial zurueck. Das Absagen von Treffen, das Gefuehl der Einsamkeit trotz Gesellschaft - das sind Zeichen, dass deine sozialen Ressourcen erschoepft sind.",
    red: "Deine soziale Isolation ist ausgepraegt. Der Rueckzug von Menschen, die dir wichtig sind, ist ein starkes Warnsignal. Isolation verstaerkt Erschoepfung - hier ist Verbindung wichtig.",
  },
  7: {
    green:
      "Du erlebst derzeit Sinn und Freude in deinem Alltag. Das ist eine wichtige Schutzressource.",
    yellow:
      "Sinn und Freude verblassen. Das Gefuehl, nur noch zu funktionieren, und die Frage Wofuer mache ich das? sind fruehe Zeichen von Burnout.",
    red: "Du hast den Zugang zu Sinn und Freude weitgehend verloren. Das ist eines der zentralen Merkmale von Burnout. Professionelle Unterstuetzung kann helfen, diesen Zugang wiederzufinden.",
  },
  8: {
    green:
      "Du kannst echte Verbindungen zu anderen Menschen aufrechterhalten. Deine emotionale Praesenz ist ein wichtiges Zeichen von Gesundheit.",
    yellow:
      "Du spuerst eine wachsende innere Distanz zu anderen. Das Gefuehl, nur noch Rollen zu spielen, ist ein Zeichen emotionaler Erschoepfung.",
    red: "Die innere Distanz zu anderen ist stark ausgepraegt. Das Gefuehl der emotionalen Kaelte und des Rueckzugs ist ein zentrales Burnout-Symptom. Hier ist professionelle Begleitung wichtig.",
  },
};

/** Pattern recognition texts */
export const PATTERN_TEXTS: Record<string, string> = {
  A1: "Koerper & Nervensystem im Dauerstress (alle drei Bereiche kritisch): Dein Schlaf, deine Energie und dein Nervensystem sind gleichzeitig stark belastet. Das ist ein ernstes Warnsignal fuer ein tiefes Erschoepfungssyndrom. Dein gesamtes System befindet sich im Ueberlebensmodus. Professionelle Unterstuetzung ist dringend empfohlen.",
  A2: "Koerper & Nervensystem unter Druck: Mindestens zwei der drei Grundbereiche - Schlaf, Energie und Nervensystem - zeigen starke Belastung. Dein Koerper und Geist kaempfen gegen die Erschoepfung. Ohne Entlastung droht eine Verschlechterung.",
  B1: "Sinnverlust & innere Distanz (beide Bereiche kritisch): Du hast den Zugang zu Sinn, Freude und echten Verbindungen weitgehend verloren. Das ist das klassische Bild von fortgeschrittenem Burnout - emotionale Erschoepfung kombiniert mit Depersonalisierung. Professionelle Begleitung ist hier besonders wichtig.",
  B2: "Sinnverlust & innere Distanz (beginnend): Die Freude an der Arbeit und das Gefuehl echter Verbindung zu anderen nehmen ab. Das sind fruehe, aber wichtige Warnsignale, die ernst genommen werden sollten.",
  C: "Kognitiv-koerperliche Ueberlastung: Dein Kopf und dein Koerper sind gleichzeitig stark belastet. Die Kombination aus mentalem Nebel und koerperlichen Stresssignalen zeigt, dass dein gesamtes System ueberlastet ist.",
  D: "Soziale Isolation als Schutzmodus: Du hast dich sowohl sozial als auch emotional stark zurueckgezogen. Dieser Rueckzug ist ein Schutzmechanismus - aber er verstaerkt langfristig die Erschoepfung und Isolation.",
  E1: "Mehrfachbelastung (6+ Bereiche kritisch): Fast alle Lebensbereiche sind stark belastet. Das ist ein deutliches Zeichen fuer ein umfassendes Erschoepfungssyndrom. Bitte suche professionelle Unterstuetzung.",
  E2: "Mehrfachbelastung (4-5 Bereiche kritisch): Mehrere Lebensbereiche sind gleichzeitig stark belastet. Das zeigt, dass die Erschoepfung systemisch ist und nicht nur einzelne Bereiche betrifft.",
  F: "Verdeckte Hochbelastung: Obwohl die Gesamtbelastung im mittleren Bereich liegt, zeigen mehrere Bereiche kritische Werte. Das kann bedeuten, dass du die Belastung kompensierst - aber die Warnsignale sollten ernst genommen werden.",
};

/** Global evaluation texts */
export const GLOBAL_TEXTS = {
  low: "Deine Gesamtbelastung ist derzeit gering bis mild. Du zeigst wenige Anzeichen von Erschoepfung. Nutze diese Phase, um praeventiv auf deine Ressourcen zu achten.",
  medium:
    "Deine Gesamtbelastung ist deutlich erhoeht. Mehrere Bereiche deines Lebens sind betroffen. Es ist wichtig, jetzt aktiv Massnahmen zu ergreifen, bevor die Erschoepfung zunimmt.",
  high: "Deine Gesamtbelastung ist hoch. Du befindest dich in einem Zustand erheblicher Erschoepfung. Professionelle Unterstuetzung - durch einen Coach, Therapeuten oder Arzt - ist dringend empfohlen.",
};

/** Compute pattern keys from area averages */
export function computePatterns(avgs: number[]): string[] {
  const patterns: string[] = [];
  const [a1, a2, a3, a4, a5, a6, a7, a8] = avgs;
  const highCount = avgs.filter((v) => v >= 14).length;
  const totalSum = avgs.reduce((s, v) => s + v, 0);

  // Pattern A: Body & nervous system
  if (a1 >= 14 && a2 >= 14 && a3 >= 14) {
    patterns.push("A1");
  } else if ([a1, a2, a3].filter((v) => v >= 14).length >= 2) {
    patterns.push("A2");
  }

  // Pattern B: Meaning loss & inner distance
  if (a7 >= 14 && a8 >= 14) {
    patterns.push("B1");
  } else if (a7 >= 7 && a8 >= 7 && (a7 >= 14 || a8 >= 14)) {
    patterns.push("B2");
  }

  // Pattern C: Cognitive-physical overload
  if (a4 >= 14 && a5 >= 14) {
    patterns.push("C");
  }

  // Pattern D: Social isolation
  if (a6 >= 14 && a8 >= 14) {
    patterns.push("D");
  }

  // Pattern E: Multiple overload
  if (highCount >= 6) {
    patterns.push("E1");
  } else if (highCount >= 4) {
    patterns.push("E2");
  }

  // Pattern F: Hidden high load
  if (totalSum >= 57 && totalSum <= 112 && highCount >= 2) {
    patterns.push("F");
  }

  return patterns;
}
