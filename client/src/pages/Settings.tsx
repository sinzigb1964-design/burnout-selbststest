import { useAuth } from "@/_core/hooks/useAuth";
import AppFooter from "@/components/AppFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import {
  AREA_TEXTS,
  GLOBAL_TEXTS,
  PATTERN_TEXTS,
  QUESTIONNAIRE_AREAS,
  computePatterns,
  getAreaLevel,
  getTotalLevel,
} from "../../../shared/questionnaire";
import { ArrowLeft, Download, Heart, Shield, Trash2, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import type { DailyEntry, TestCycle, User as UserType } from "../../../drizzle/schema";

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

/** Bereichssummen aus allen DailyEntries eines Zyklus berechnen (Durchschnitt über 14 Tage) */
function computeCycleAreaAvgs(entries: DailyEntry[]): number[] {
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

function computeCycleTotalScore(entries: DailyEntry[]): number {
  if (entries.length === 0) return 0;
  return Math.round(entries.reduce((acc, e) => acc + e.totalDayScore, 0) / entries.length);
}

// ─── PDF-Generierung ──────────────────────────────────────────────────────────

async function generatePDF(data: {
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

    // Einträge für diesen Zyklus filtern
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

    // Globaler Auswertungstext
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

    y += 10;
  }

  // ── Fußzeile auf jeder Seite ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const ph = doc.internal.pageSize.getHeight();
    doc.text(`Burnout Selbsttest – Bernd Sinzig  |  Seite ${i} von ${pageCount}`, margin, ph - 8);
    doc.text(
      "Dieser Bericht ist vertraulich und ausschließlich für den persönlichen Gebrauch bestimmt.",
      margin, ph - 4
    );
  }

  doc.save(`burnout-selbsttest-${new Date().toISOString().split("T")[0]}.pdf`);
}

// ─── Komponente ───────────────────────────────────────────────────────────────

export default function Settings() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { refetch: fetchExport } = trpc.gdpr.exportData.useQuery(undefined, {
    enabled: false,
  });

  const deleteAccount = trpc.gdpr.deleteAccount.useMutation({
    onSuccess: () => {
      toast.success("Konto und alle Daten wurden gelöscht.");
      logout();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await fetchExport();
      if (result.data) {
        await generatePDF(result.data as Parameters<typeof generatePDF>[0]);
        toast.success("PDF wurde erfolgreich erstellt und heruntergeladen.");
      }
    } catch (err) {
      console.error(err);
      toast.error("PDF-Export fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-bold text-foreground">Einstellungen & Datenschutz</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-2xl space-y-6">
        {/* Profil */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Mein Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">Rolle: {user?.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DSGVO */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Datenschutz (DSGVO)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground leading-relaxed">
              Gemäß DSGVO hast du das Recht auf Auskunft, Berichtigung, Löschung und
              Datenübertragbarkeit. Nutze die folgenden Optionen, um deine Rechte wahrzunehmen.
            </div>

            {/* PDF-Export */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Daten als PDF exportieren</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Lade alle deine Testergebnisse und Auswertungen als übersichtliches PDF herunter
                  (Art. 20 DSGVO – Datenübertragbarkeit). Das PDF enthält Scores, Bereichsanalysen
                  und erkannte Belastungsmuster für jeden abgeschlossenen Zyklus.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isExporting}
                className="shrink-0"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? "Wird erstellt …" : "PDF herunterladen"}
              </Button>
            </div>

            {/* Konto löschen */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-destructive/30 bg-destructive/5">
              <div>
                <p className="text-sm font-medium text-destructive">Konto löschen</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Löscht dein Konto und alle gespeicherten Daten unwiderruflich (Art. 17 DSGVO –
                  Recht auf Vergessenwerden).
                </p>
              </div>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="shrink-0">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Löschen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Konto wirklich löschen?</DialogTitle>
                    <DialogDescription>
                      Diese Aktion ist unwiderruflich. Alle deine Daten – Fragebogen-Antworten,
                      Auswertungen und Coach-Freigaben – werden permanent gelöscht. Du wirst
                      sofort abgemeldet.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Abbrechen
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteAccount.mutate()}
                      disabled={deleteAccount.isPending}
                    >
                      {deleteAccount.isPending ? "Wird gelöscht …" : "Ja, Konto löschen"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Abmelden */}
        <Card className="border-border">
          <CardContent className="p-4">
            <Button variant="outline" className="w-full" onClick={logout}>
              Abmelden
            </Button>
          </CardContent>
        </Card>
      </div>
      <AppFooter />
    </div>
  );
}
