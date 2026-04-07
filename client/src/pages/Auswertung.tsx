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
  Share2,
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
      <div className="border-b border-border bg-primary">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-7 h-7 rounded-md bg-primary-foreground/20 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold text-primary-foreground">Selbsttest Burnout Check</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
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
                <div className="mt-5 flex flex-col gap-3">
                  {closingContent.ctaLabel && closingContent.ctaUrl && (
                    <a
                      href={closingContent.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors w-fit"
                    >
                      {closingContent.ctaLabel}
                    </a>
                  )}
                  <a
                    href="https://zeeg.me/bsinzig/P00U26"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline w-fit"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Kontakt zu Bernd
                  </a>
                </div>
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
                Diese Auswertung ist kein medizinisches Diagnosewerkzeug. Sie dient deiner
                persönlichen Reflexion und Selbsteinschätzung. Bei ernsthaften Beschwerden oder
                Unsicherheiten wende dich bitte an eine Ärztin, einen Arzt, eine Therapeutin,
                einen Therapeuten.
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

        {/* Feedback & Share Section */}
        <div className="mt-12 pt-12 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-muted/30 rounded-xl border border-border">
            <div>
              <p className="font-medium text-foreground">Hat Ihnen dieser Beitrag gefallen?</p>
            </div>
            <button
              onClick={() => {
                const url = window.location.href;
                const text = "Burnout Selbsttest – Erkenne Burnout-Risiken, bevor sie dich einholen.";
                
                // Create share menu
                const menu = document.createElement('div');
                menu.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-4 z-50 min-w-48';
                menu.innerHTML = `
                  <div class="space-y-2">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-sm">
                      <svg class="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-sm">
                      <svg class="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </a>
                    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}" target="_blank" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-sm">
                      <svg class="w-5 h-5" fill="#000" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.586c-1.017.507-2.12.88-3.286 1.071 1.182-.711 2.088-1.84 2.513-3.179-1.107.656-2.333 1.132-3.644 1.39-1.043-1.112-2.527-1.8-4.163-1.8-3.15 0-5.7 2.55-5.7 5.7 0 .448.056.885.167 1.307-4.73-.24-8.93-2.502-11.74-5.942-.49.84-.77 1.817-.77 2.86 0 1.98 1.008 3.73 2.542 4.76-.938-.03-1.82-.288-2.59-.717v.07c0 2.76 1.96 5.06 4.56 5.576-.476.13-.98.2-1.5.2-.366 0-.72-.035-1.066-.104.722 2.213 2.8 3.82 5.274 3.864-1.95 1.527-4.4 2.44-7.07 2.44-.46 0-.91-.026-1.35-.078 2.54 1.627 5.56 2.576 8.76 2.576 10.51 0 16.24-8.7 16.24-16.24 0-.248-.005-.494-.015-.74 1.116-.805 2.083-1.81 2.847-2.96z"/></svg>
                      Twitter
                    </a>
                    <a href="mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-sm">
                      <svg class="w-5 h-5" fill="#EA4335" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                      E-Mail
                    </a>
                  </div>
                `;
                document.body.appendChild(menu);
                
                // Close menu on click outside
                const closeMenu = () => {
                  menu.remove();
                  document.removeEventListener('click', closeMenu);
                };
                setTimeout(() => document.addEventListener('click', closeMenu), 0);
              }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              Teilen
            </button>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
