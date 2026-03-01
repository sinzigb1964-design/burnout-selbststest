import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import AppFooter from "@/components/AppFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { generatePDF } from "@/lib/generatePdf";
import {
  AREA_TEXTS,
  GLOBAL_TEXTS,
  PATTERN_TEXTS,
  PATTERN_INFO,
  QUESTIONNAIRE_AREAS,
  getAreaLevel,
  getTotalLevel,
} from "../../../shared/questionnaire";
import { buildIntroText } from "../../../shared/introText";
import { buildClosingText } from "../../../shared/closingText";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Heart,
  Info,
  MessageSquare,
  Printer,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation, useParams } from "wouter";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const LEVEL_COLORS = {
  green: { bar: "#22c55e", bg: "bg-status-green/10", border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-800" },
  yellow: { bar: "#f59e0b", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", badge: "bg-yellow-100 text-yellow-800" },
  red: { bar: "#ef4444", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-800" },
};

const LEVEL_LABELS = {
  green: "Gering",
  yellow: "Deutlich",
  red: "Stark",
};

export default function Auswertung() {
  const params = useParams<{ cycleId: string }>();
  const cycleId = parseInt(params.cycleId || "0");
  const [, navigate] = useLocation();

  const { data, isLoading, error } = trpc.cycle.getEvaluation.useQuery({ cycleId });
  const [isPrinting, setIsPrinting] = useState(false);

  const { refetch: fetchExport } = trpc.gdpr.exportData.useQuery(undefined, {
    enabled: false,
  });

  const handlePrint = async () => {
    setIsPrinting(true);
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
      setIsPrinting(false);
    }
  };

  // Hooks müssen VOR allen bedingten Returns stehen (Rules of Hooks)
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Auswertung wird berechnet...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.evaluation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">Keine Auswertung verfügbar</h2>
            <p className="text-muted-foreground text-sm mb-4">
              {data?.entries?.length
                ? `Es wurden ${data.entries.length} von 14 Tagen erfasst. Fuelle alle 14 Tage aus fuer eine vollstaendige Auswertung.`
                : "Keine Eintraege gefunden."}
            </p>
            <Button onClick={() => navigate("/dashboard")}>Zum Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { evaluation, cycle, entries } = data;
  const { avgs, totalSum, patterns, areaLevels, totalLevel, daysCompleted } = evaluation;

  const chartData = QUESTIONNAIRE_AREAS.map((area, i) => ({
    name: area.title.split(" ")[0],
    fullName: area.title,
    value: Math.round(avgs[i] * 10) / 10,
    level: areaLevels[i] as "green" | "yellow" | "red",
  }));

  const totalLevelKey = getTotalLevel(totalSum);
  const totalColor = totalLevelKey === "low" ? "text-green-600" : totalLevelKey === "medium" ? "text-yellow-600" : "text-red-600";
  const totalBg = totalLevelKey === "low" ? "bg-green-50 border-green-200" : totalLevelKey === "medium" ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200";

  const closingContent = buildClosingText(totalLevelKey, user?.name?.split(" ")[0] || "");

  const introText = buildIntroText({
    userName: user?.name,
    daysCompleted,
    totalSum,
    avgs,
    cycleStartDate: cycle.startDate,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 flex-1">
              <Heart className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-bold text-foreground">14-Tage-Auswertung</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              {isPrinting ? "Wird erstellt…" : "PDF herunterladen"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 mb-8 text-sm text-muted-foreground">
          <span>
            Zyklus vom{" "}
            {new Date(cycle.startDate).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>•</span>
          <span>14 von 14 Tagen erfasst</span>
          {daysCompleted < 14 && (
            <Badge variant="secondary" className="text-xs">
              Vorlaeufige Auswertung
            </Badge>
          )}
        </div>

        {/* Einleitungsabsatz */}
        <Card className="border-border mb-8 bg-card">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-2">Dein persönlicher Bericht</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{introText}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gesamtbelastung */}
        <Card className={`border-2 mb-8 ${totalBg}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Gesamtbelastung</p>
                <div className="flex items-baseline gap-3">
                  <span className={`text-4xl font-bold ${totalColor}`}>
                    {Math.round(totalSum * 10) / 10}
                  </span>
                  <span className="text-muted-foreground text-sm">von 168</span>
                </div>
                <p className="text-sm text-foreground mt-3 leading-relaxed">
                  {GLOBAL_TEXTS[totalLevelKey]}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  totalLevelKey === "low" ? "bg-green-100 text-green-800" :
                  totalLevelKey === "medium" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {totalLevelKey === "low" ? "Niedrig" : totalLevelKey === "medium" ? "Deutlich" : "Hoch"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="border-border mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Übersicht nach Bereichen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    domain={[0, 21]}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    ticks={[0, 7, 14, 21]}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-md">
                            <p className="font-medium text-foreground text-sm">{d.fullName}</p>
                            <p className="text-muted-foreground text-xs">
                              Durchschnitt: <span className="font-semibold">{d.value}</span> / 21
                            </p>
                            <p className={`text-xs font-medium ${LEVEL_COLORS[d.level as "green" | "yellow" | "red"].text}`}>
                              {LEVEL_LABELS[d.level as "green" | "yellow" | "red"]} Belastung
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Reference lines for thresholds */}
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={LEVEL_COLORS[entry.level].bar} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground justify-center">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> Gering (0-6.9)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" /> Deutlich (7-13.9)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> Stark (14-21)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Patterns */}
        {patterns.length > 0 && (
          <Card className="border-border mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Erkannte Belastungsmuster
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patterns.map((pattern) => {
                const info = PATTERN_INFO[pattern];
                const isCritical = info?.severity === "critical";
                return (
                  <div
                    key={pattern}
                    className={`flex items-start gap-3 p-4 rounded-lg border ${
                      isCritical
                        ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                        : "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-5 h-5 mt-0.5 shrink-0 ${
                        isCritical ? "text-red-600" : "text-amber-600"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      {info ? (
                        <>
                          <p className={`text-sm font-bold mb-0.5 ${
                            isCritical ? "text-red-800 dark:text-red-300" : "text-amber-800 dark:text-amber-300"
                          }`}>
                            {info.title}
                          </p>
                          <p className="text-xs text-muted-foreground mb-2 italic">
                            {info.subtitle}
                          </p>
                          <p className="text-sm text-foreground leading-relaxed">
                            {info.description}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-foreground leading-relaxed">
                          {PATTERN_TEXTS[pattern]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Area details */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Auswertung nach Bereichen
          </h2>
          {QUESTIONNAIRE_AREAS.map((area, i) => {
            const avg = avgs[i];
            const levelRaw = areaLevels[i];
            const level = (levelRaw === "green" || levelRaw === "yellow" || levelRaw === "red" ? levelRaw : "green") as "green" | "yellow" | "red";
            const colors = LEVEL_COLORS[level];
            const text = AREA_TEXTS[area.id]?.[level] || "";
            const pct = Math.round((avg / 21) * 100);

            return (
              <Card key={area.id} className={`border ${colors.border}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {area.id}
                      </div>
                      <h3 className="font-semibold text-foreground">{area.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold text-foreground">
                        {Math.round(avg * 10) / 10}
                        <span className="text-muted-foreground font-normal text-xs"> / 21</span>
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {LEVEL_LABELS[level]}
                      </span>
                    </div>
                  </div>
                  {/* Mini bar */}
                  <div className="h-2 bg-muted rounded-full mb-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: colors.bar,
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tagesnotizen */}
        {entries.some((e: { noteText?: string | null }) => e.noteText) && (
          <Card className="border-border mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Tagesnotizen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {entries
                .filter((e: { noteText?: string | null }) => e.noteText)
                .sort((a: { dayNumber: number }, b: { dayNumber: number }) => a.dayNumber - b.dayNumber)
                .map((e: { id: number; dayNumber: number; noteText?: string | null; entryDate: Date }) => (
                  <div key={e.id} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {e.dayNumber}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">
                        Tag {e.dayNumber} &ndash; {new Date(e.entryDate).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">{e.noteText}</p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Abschlusstext von Bernd Sinzig */}
        <Card className={`border-2 mb-8 ${
          totalLevelKey === "low"
            ? "border-green-200 bg-green-50/40"
            : totalLevelKey === "medium"
            ? "border-amber-200 bg-amber-50/40"
            : "border-red-200 bg-red-50/40"
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663325194886/kUhDEWUQxkuYXEHuB7K7Rz/bernd-sinzig-profilbild_abb6ce9e.jpg"
                alt="Bernd Sinzig – Burnout LIFEBACK® Guide"
                className="w-14 h-14 rounded-full object-cover object-top shrink-0 mt-0.5 ring-2 ring-primary/20"
              />
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-4 text-base">{closingContent.heading}</h3>
                <div className="space-y-3">
                  {closingContent.paragraphs.map((para, i) => (
                    <p key={i} className={`text-sm leading-relaxed ${
                      para.startsWith("„") || para.startsWith('"')
                        ? "text-foreground font-medium italic border-l-2 border-primary/40 pl-3"
                        : "text-muted-foreground"
                    }`}>
                      {para}
                    </p>
                  ))}
                </div>
                {closingContent.ctaLabel && closingContent.ctaUrl && (
                  <div className="mt-5">
                    <a
                      href={closingContent.ctaUrl}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors ${
                        totalLevelKey === "high"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-amber-600 hover:bg-amber-700"
                      }`}
                    >
                      {closingContent.ctaLabel}
                    </a>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-5 whitespace-pre-line font-medium">
                  {closingContent.signature}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-border bg-muted/30 mb-8">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Diese Auswertung ist kein medizinisches Diagnosewerkzeug. Sie dient der
                persoenlichen Reflexion und Selbsteinschaetzung. Bei ernsthaften Beschwerden oder
                Unsicherheiten wende dich bitte an einen Arzt, Therapeuten oder qualifizierten
                Coach.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zum Dashboard
          </Button>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
