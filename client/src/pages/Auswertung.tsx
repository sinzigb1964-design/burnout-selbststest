import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  AREA_TEXTS,
  GLOBAL_TEXTS,
  PATTERN_TEXTS,
  QUESTIONNAIRE_AREAS,
  getAreaLevel,
  getTotalLevel,
} from "../../../shared/questionnaire";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Heart,
  Info,
  TrendingUp,
} from "lucide-react";
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
              <h1 className="text-lg font-bold text-foreground">14-Tage-Auswertung</h1>
            </div>
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
          <span>{daysCompleted} von 14 Tagen erfasst</span>
          {daysCompleted < 14 && (
            <Badge variant="secondary" className="text-xs">
              Vorlaeufige Auswertung
            </Badge>
          )}
        </div>

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
              {patterns.map((pattern) => (
                <div
                  key={pattern}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Muster {pattern}
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {PATTERN_TEXTS[pattern]}
                    </p>
                  </div>
                </div>
              ))}
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
    </div>
  );
}
