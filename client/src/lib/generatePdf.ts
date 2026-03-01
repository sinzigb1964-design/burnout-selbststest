import {
  AREA_TEXTS,
  GLOBAL_TEXTS,
  PATTERN_TEXTS,
  QUESTIONNAIRE_AREAS,
  computePatterns,
  getAreaLevel,
  getTotalLevel,
} from "../../../shared/questionnaire";
import type { DailyEntry, TestCycle, User as UserType } from "../../../drizzle/schema";
import { buildIntroText } from "../../../shared/introText";

// ─── Hilfsfunktionen ──────────────────────────────────────────────────────────

function levelLabel(level: "green" | "yellow" | "red"): string {
  if (level === "green") return "Gering";
  if (level === "yellow") return "Deutlich";
  return "Stark";
}

function totalLevelLabel(level: "low" | "medium" | "high"): string {
  if (level === "low") return "Niedrig / Mild";
  if (level === "medium") return "Deutlich erhöht";
  return "Hoch";
}

export function computeCycleAreaAvgs(entries: DailyEntry[]): number[] {
  if (entries.length === 0) return Array(8).fill(0) as number[];
  const sums = [0, 0, 0, 0, 0, 0, 0, 0];
  for (const e of entries) {
    sums[0] += e.sumB1;
    sums[1] += e.sumB2;
    sums[2] += e.sumB3;
    sums[3] += e.sumB4;
    sums[4] += e.sumB5;
    sums[5] += e.sumB6;
    sums[6] += e.sumB7;
    sums[7] += e.sumB8;
  }
  return sums.map((s) => s / entries.length);
}

export function computeCycleTotalScore(entries: DailyEntry[]): number {
  if (entries.length === 0) return 0;
  return Math.round(entries.reduce((acc, e) => acc + e.totalDayScore, 0) / entries.length);
}

// ─── PDF-Generierung ──────────────────────────────────────────────────────────

export async function generatePDF(data: {
  user: UserType | undefined;
  cycles: TestCycle[];
  entries: DailyEntry[];
}) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentW = pageW - margin * 2;

  const PRIMARY: [number, number, number] = [30, 90, 110];
  const LIGHT_BG: [number, number, number] = [245, 248, 250];
  const GREEN_C: [number, number, number] = [34, 139, 34];
  const YELLOW_C: [number, number, number] = [200, 140, 0];
  const RED_C: [number, number, number] = [180, 40, 40];

  function levelColor(level: "green" | "yellow" | "red"): [number, number, number] {
    if (level === "green") return GREEN_C;
    if (level === "yellow") return YELLOW_C;
    return RED_C;
  }

  let y = margin;

  // ── Deckblatt-Header ──
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageW, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Burnout Selbsttest", margin, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Persönlicher Auswertungsbericht", margin, 27);
  doc.text(`Erstellt am: ${new Date().toLocaleDateString("de-DE")}`, margin, 34);

  y = 50;
  doc.setTextColor(0, 0, 0);

  // ── Nutzerdaten ──
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(margin, y, contentW, 22, 3, 3, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Name:", margin + 4, y + 8);
  doc.setFont("helvetica", "normal");
  doc.text(data.user?.name ?? "–", margin + 30, y + 8);
  doc.setFont("helvetica", "bold");
  doc.text("E-Mail:", margin + 4, y + 15);
  doc.setFont("helvetica", "normal");
  doc.text(data.user?.email ?? "–", margin + 30, y + 15);
  y += 30;

  // ── Hinweis ──
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Hinweis: Dieser Bericht ist kein medizinisches Diagnosewerkzeug. Er dient der persönlichen Reflexion.",
    margin, y
  );
  doc.setTextColor(0, 0, 0);
  y += 10;

  // ── Zyklen ──
  const completedCycles = data.cycles.filter((c) => c.status === "completed");

  if (completedCycles.length === 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Noch keine abgeschlossenen Testzyklen vorhanden.", margin, y);
    doc.save(`burnout-selbsttest-${new Date().toISOString().split("T")[0]}.pdf`);
    return;
  }

  for (const cycle of completedCycles) {
    if (y > 240) { doc.addPage(); y = margin; }

    const cycleEntries = data.entries.filter((e) => e.cycleId === cycle.id);
    const areaAvgs = computeCycleAreaAvgs(cycleEntries);
    const totalScore = computeCycleTotalScore(cycleEntries);
    const totalLevel = getTotalLevel(totalScore);

    // ── Zyklus-Header ──
    doc.setFillColor(...PRIMARY);
    doc.roundedRect(margin, y, contentW, 12, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    const startStr = new Date(cycle.startDate).toLocaleDateString("de-DE");
    const endStr = cycle.endDate ? new Date(cycle.endDate).toLocaleDateString("de-DE") : "–";
    doc.text(`14-Tage-Zyklus: ${startStr} – ${endStr}  (${cycleEntries.length} Einträge)`, margin + 4, y + 8);
    y += 16;
    doc.setTextColor(0, 0, 0);

    // ── Einleitungsabsatz ──
    const introText = buildIntroText({
      userName: data.user?.name,
      daysCompleted: cycleEntries.length,
      totalSum: totalScore,
      avgs: areaAvgs,
      cycleStartDate: cycle.startDate,
    });
    const introLines = doc.splitTextToSize(introText, contentW) as string[];
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(60, 60, 60);
    // Hintergrundbox für Einleitung
    const introBoxH = introLines.length * 5 + 8;
    doc.setFillColor(245, 248, 250);
    doc.roundedRect(margin, y, contentW, introBoxH, 2, 2, "F");
    doc.text(introLines, margin + 4, y + 6);
    doc.setTextColor(0, 0, 0);
    y += introBoxH + 6;

    // ── Gesamtscore ──
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Ø Tagesbelastung:", margin, y + 6);
    doc.setFont("helvetica", "normal");
    const tlColor = levelColor(totalLevel === "low" ? "green" : totalLevel === "medium" ? "yellow" : "red");
    doc.setTextColor(...tlColor);
    doc.text(`${totalScore} / 168 Punkte  –  ${totalLevelLabel(totalLevel)}`, margin + 46, y + 6);
    doc.setTextColor(0, 0, 0);
    y += 10;

    const globalText = GLOBAL_TEXTS[totalLevel];
    const globalLines = doc.splitTextToSize(globalText, contentW);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text(globalLines, margin, y + 4);
    y += (globalLines as string[]).length * 5 + 6;

    // ── Bereichs-Tabelle ──
    const tableBody = QUESTIONNAIRE_AREAS.map((area, i) => {
      const avg = areaAvgs[i] ?? 0;
      const level = getAreaLevel(avg);
      return [area.title, `${avg.toFixed(1)} / 21`, levelLabel(level)];
    });

    autoTable(doc, {
      startY: y,
      head: [["Bereich", "Ø Summe", "Belastungsstufe"]],
      body: tableBody,
      margin: { left: margin, right: margin },
      headStyles: { fillColor: PRIMARY, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 30, halign: "center" },
        2: { cellWidth: 40, halign: "center" },
      },
      didParseCell: (hookData) => {
        if (hookData.section === "body" && hookData.column.index === 2) {
          const val = hookData.cell.raw as string;
          if (val === "Gering") hookData.cell.styles.textColor = GREEN_C;
          else if (val === "Deutlich") hookData.cell.styles.textColor = YELLOW_C;
          else if (val === "Stark") hookData.cell.styles.textColor = RED_C;
        }
      },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

    // ── Balkendiagramm ──
    if (y > 200) { doc.addPage(); y = margin; }
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Belastungsprofil nach Bereichen", margin, y);
    y += 6;

    const areaShortNames = [
      "Schlaf", "Energie", "Nervensystem", "Konzentration",
      "Körper", "Soziales", "Sinn & Freude", "Innere Distanz",
    ];

    const chartH = 75;
    const barAreaTop = y + 6;
    const barAreaH = 38;
    const barAreaBottom = barAreaTop + barAreaH;
    const maxVal = 21;
    const barW = (contentW - 20) / 8;
    const barGap = 2;

    doc.setFillColor(245, 248, 250);
    doc.roundedRect(margin, y, contentW, chartH, 2, 2, "F");

    const greenThreshold = 7;
    const yellowThreshold = 14;
    const greenY = barAreaBottom - (greenThreshold / maxVal) * barAreaH;
    const yellowY = barAreaBottom - (yellowThreshold / maxVal) * barAreaH;

    doc.setDrawColor(200, 140, 0);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([1.5, 1], 0);
    doc.line(margin + 10, greenY, margin + contentW - 4, greenY);
    doc.setFontSize(6);
    doc.setTextColor(200, 140, 0);
    doc.text("7", margin + 4, greenY + 1.5);

    doc.setDrawColor(180, 40, 40);
    doc.setLineDashPattern([1.5, 1], 0);
    doc.line(margin + 10, yellowY, margin + contentW - 4, yellowY);
    doc.setTextColor(180, 40, 40);
    doc.text("14", margin + 3, yellowY + 1.5);

    doc.setLineDashPattern([], 0);
    doc.setLineWidth(0.1);

    for (let i = 0; i < 8; i++) {
      const avg = areaAvgs[i] ?? 0;
      const level = getAreaLevel(avg);
      const barColor = level === "green" ? GREEN_C : level === "yellow" ? YELLOW_C : RED_C;
      const barHeight = Math.max(1, (avg / maxVal) * barAreaH);
      const barX = margin + 10 + i * barW + barGap / 2;
      const barY = barAreaBottom - barHeight;
      const barWidth = barW - barGap;

      doc.setFillColor(...barColor);
      doc.rect(barX, barY, barWidth, barHeight, "F");

      doc.setFontSize(6);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(avg.toFixed(1), barX + barWidth / 2, barY - 1, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(60, 60, 60);
      const labelX = barX + barWidth / 2 + 1;
      const labelY = barAreaBottom + 3;
      doc.text(areaShortNames[i] ?? `B${i + 1}`, labelX, labelY, { angle: 45 });
    }

    const legendY = barAreaBottom + 9;
    const legendItems: Array<{ color: [number, number, number]; label: string }> = [
      { color: GREEN_C, label: "Gering (0–7)" },
      { color: YELLOW_C, label: "Deutlich (8–14)" },
      { color: RED_C, label: "Stark (15–21)" },
    ];
    let legendX = margin + 10;
    doc.setFontSize(7);
    for (const item of legendItems) {
      doc.setFillColor(...item.color);
      doc.rect(legendX, legendY - 2.5, 4, 3, "F");
      doc.setTextColor(60, 60, 60);
      doc.text(item.label, legendX + 5.5, legendY);
      legendX += 45;
    }

    y += chartH + 8;
    doc.setTextColor(0, 0, 0);

    // ── Liniendiagramm: Tagesverlauf ──
    if (y > 200) { doc.addPage(); y = margin; }
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Tagesverlauf Gesamtbelastung (14 Tage)", margin, y);
    y += 6;

    const lineChartH = 55;
    const lineAreaTop = y + 6;
    const lineAreaH = 38;
    const lineAreaBottom = lineAreaTop + lineAreaH;
    const lineAreaLeft = margin + 14;
    const lineAreaRight = margin + contentW - 4;
    const lineAreaW = lineAreaRight - lineAreaLeft;
    const maxScore = 168;

    doc.setFillColor(245, 248, 250);
    doc.roundedRect(margin, y, contentW, lineChartH, 2, 2, "F");

    const thresholds = [
      { value: 56,  color: GREEN_C as [number, number, number], label: "56" },
      { value: 112, color: YELLOW_C as [number, number, number], label: "112" },
    ];
    for (const t of thresholds) {
      const ty = lineAreaBottom - (t.value / maxScore) * lineAreaH;
      doc.setDrawColor(...t.color);
      doc.setLineWidth(0.3);
      doc.setLineDashPattern([1.5, 1], 0);
      doc.line(lineAreaLeft, ty, lineAreaRight, ty);
      doc.setFontSize(6);
      doc.setTextColor(...t.color);
      doc.text(t.label, margin + 2, ty + 1.5);
    }
    doc.setLineDashPattern([], 0);
    doc.setLineWidth(0.1);
    doc.setTextColor(0, 0, 0);

    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(lineAreaLeft, lineAreaBottom, lineAreaRight, lineAreaBottom);

    const sortedEntries = [...cycleEntries].sort((a, b) => a.dayNumber - b.dayNumber);
    const n = sortedEntries.length;

    if (n > 0) {
      const stepX = n > 1 ? lineAreaW / (n - 1) : lineAreaW / 2;

      doc.setDrawColor(...PRIMARY);
      doc.setLineWidth(0.8);
      for (let d = 0; d < n - 1; d++) {
        const x1 = lineAreaLeft + d * stepX;
        const y1 = lineAreaBottom - ((sortedEntries[d]!.totalDayScore / maxScore) * lineAreaH);
        const x2 = lineAreaLeft + (d + 1) * stepX;
        const y2 = lineAreaBottom - ((sortedEntries[d + 1]!.totalDayScore / maxScore) * lineAreaH);
        doc.line(x1, y1, x2, y2);
      }

      for (let d = 0; d < n; d++) {
        const entry = sortedEntries[d]!;
        const px = lineAreaLeft + d * (n > 1 ? stepX : lineAreaW / 2);
        const py = lineAreaBottom - ((entry.totalDayScore / maxScore) * lineAreaH);
        const score = entry.totalDayScore;
        const ptLevel = score <= 56 ? "green" : score <= 112 ? "yellow" : "red";
        const ptColor = levelColor(ptLevel);

        doc.setFillColor(...ptColor);
        doc.circle(px, py, 1.2, "F");

        doc.setFontSize(5.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(String(score), px, py - 2.5, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        doc.text(`Tag ${entry.dayNumber}`, px, lineAreaBottom + 4, { align: "center" });
      }
    } else {
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150, 150, 150);
      doc.text("Keine Tagesdaten vorhanden", lineAreaLeft + lineAreaW / 2, lineAreaTop + lineAreaH / 2, { align: "center" });
    }

    y += lineChartH + 8;
    doc.setTextColor(0, 0, 0);

    // ── Bereichsspezifische Texte ──
    if (y > 230) { doc.addPage(); y = margin; }
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Bereichsspezifische Auswertung", margin, y);
    y += 6;

    for (let i = 0; i < 8; i++) {
      if (y > 250) { doc.addPage(); y = margin; }
      const avg = areaAvgs[i] ?? 0;
      const level = getAreaLevel(avg);
      const areaTitle = QUESTIONNAIRE_AREAS[i]?.title ?? `Bereich ${i + 1}`;
      const areaText = AREA_TEXTS[i + 1]?.[level] ?? "";

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...levelColor(level));
      doc.text(`${areaTitle}  (${levelLabel(level)})`, margin, y);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(areaText, contentW) as string[];
      doc.text(lines, margin, y + 5);
      y += lines.length * 4.5 + 8;
    }

    // ── Erkannte Muster ──
    const patterns = computePatterns(areaAvgs);
    if (patterns.length > 0) {
      if (y > 230) { doc.addPage(); y = margin; }
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Erkannte Belastungsmuster", margin, y);
      y += 6;

      for (const p of patterns) {
        if (y > 250) { doc.addPage(); y = margin; }
        const pText = PATTERN_TEXTS[p] ?? "";
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(`Muster ${p}`, margin, y);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(pText, contentW) as string[];
        doc.text(lines, margin, y + 5);
        y += lines.length * 4.5 + 8;
      }
    }

    // ── Tagesnotizen ──
    const notesWithText = cycleEntries
      .filter((e) => e.noteText)
      .sort((a, b) => a.dayNumber - b.dayNumber);

    if (notesWithText.length > 0) {
      if (y > 230) { doc.addPage(); y = margin; }
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Tagesnotizen", margin, y);
      y += 6;

      for (const entry of notesWithText) {
        if (y > 250) { doc.addPage(); y = margin; }
        const dateStr = new Date(entry.entryDate).toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text(`Tag ${entry.dayNumber}  –  ${dateStr}`, margin, y);
        doc.setFont("helvetica", "normal");
        const noteLines = doc.splitTextToSize(entry.noteText ?? "", contentW) as string[];
        doc.text(noteLines, margin, y + 5);
        y += noteLines.length * 4.5 + 8;
      }
    }

    y += 10;
  }

  // ── Fußzeile auf jeder Seite ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const ph = doc.internal.pageSize.getHeight();
    doc.text(`Selbsttest Burnout Belastung  .  Burnout LIFEBACK™ Guide 2026  |  Seite ${i} von ${pageCount}`, margin, ph - 8);
    doc.text(
      "Dieser Bericht ist vertraulich und ausschließlich für den persönlichen Gebrauch bestimmt.",
      margin, ph - 4
    );
  }

  doc.save(`burnout-selbsttest-${new Date().toISOString().split("T")[0]}.pdf`);
}
