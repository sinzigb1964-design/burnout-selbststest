import { Button } from "@/components/ui/button";
import AppFooter from "@/components/AppFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { QUESTIONNAIRE_AREAS, getAreaLevel, PATTERN_INFO } from "../../../shared/questionnaire";
import { buildIntroText } from "../../../shared/introText";
import { ArrowLeft, BarChart3, Heart, Info } from "lucide-react";
import { useState } from "react";
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
  green: "#22c55e",
  yellow: "#f59e0b",
  red: "#ef4444",
};

export default function CoachKlient() {
  const params = useParams<{ userId: string }>();
  const userId = parseInt(params.userId || "0");
  const [, navigate] = useLocation();
  const [selectedCycleId, setSelectedCycleId] = useState<number | null>(null);

  const { data: cycles, isLoading: cyclesLoading } = trpc.coach.clientCycles.useQuery({ userId });

  const activeCycleId = selectedCycleId || cycles?.[0]?.id || 0;

  const { data: evalData, isLoading: evalLoading } = trpc.coach.clientEvaluation.useQuery(
    { userId, cycleId: activeCycleId },
    { enabled: activeCycleId > 0 }
  );

  const isLoading = cyclesLoading || evalLoading;

  const chartData = evalData?.evaluation
    ? QUESTIONNAIRE_AREAS.map((area, i) => ({
        name: area.title.split(" ")[0],
        fullName: area.title,
        value: Math.round((evalData.evaluation!.avgs[i] ?? 0) * 10) / 10,
        level: getAreaLevel(evalData.evaluation!.avgs[i] ?? 0),
      }))
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/coach")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {evalData?.user?.name || "Klient"}
                </h1>
                <p className="text-xs text-muted-foreground">{evalData?.user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-3xl">
        {/* Cycle selector */}
        {cycles && cycles.length > 1 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {cycles.map((cycle) => (
              <button
                key={cycle.id}
                onClick={() => setSelectedCycleId(cycle.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCycleId === cycle.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {new Date(cycle.startDate).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : evalData?.evaluation ? (
          <>
            {/* Summary */}
            <Card className="border-border mb-6">
              <CardContent className="p-5">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round(evalData.evaluation.totalSum * 10) / 10}
                    </p>
                    <p className="text-xs text-muted-foreground">Gesamtscore / 168</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {evalData.evaluation.daysCompleted}
                    </p>
                    <p className="text-xs text-muted-foreground">Tage erfasst</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {evalData.evaluation.patterns.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Muster erkannt</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Einleitungsabsatz */}
            {(() => {
              const cycle = cycles?.find((c) => c.id === activeCycleId);
              if (!cycle) return null;
              const introText = buildIntroText({
                userName: evalData.user?.name,
                daysCompleted: evalData.evaluation.daysCompleted,
                totalSum: evalData.evaluation.totalSum,
                avgs: evalData.evaluation.avgs,
                cycleStartDate: cycle.startDate,
              });
              return (
                <Card className="border-border mb-6 bg-card">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <img
                        src="https://d2xsxph8kpxj0f.cloudfront.net/310519663325194886/kUhDEWUQxkuYXEHuB7K7Rz/bernd-sinzig-profilbild_abb6ce9e.jpg"
                        alt="Bernd Sinzig"
                        className="w-10 h-10 rounded-full object-cover object-top shrink-0 mt-0.5 ring-2 ring-primary/20"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-foreground mb-1.5">Persönliche Einschätzung</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{introText}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Chart */}
            <Card className="border-border mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Bereichsübersicht
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <YAxis domain={[0, 21]} ticks={[0, 7, 14, 21]} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload?.[0]) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-card border border-border rounded-lg p-2 shadow-md text-xs">
                                <p className="font-medium">{d.fullName}</p>
                                <p className="text-muted-foreground">Ø {d.value} / 21</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={LEVEL_COLORS[entry.level as "green" | "yellow" | "red"]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Patterns */}
            {evalData.evaluation.patterns.length > 0 && (
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Erkannte Belastungsmuster</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {evalData.evaluation.patterns.map((p) => {
                    const info = PATTERN_INFO[p];
                    const isCritical = info?.severity === "critical";
                    return (
                      <div
                        key={p}
                        className={`p-3 rounded-lg border text-sm ${
                          isCritical
                            ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                            : "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
                        }`}
                      >
                        {info ? (
                          <>
                            <p className={`font-semibold mb-0.5 ${
                              isCritical ? "text-red-800 dark:text-red-300" : "text-amber-800 dark:text-amber-300"
                            }`}>
                              {info.title}
                            </p>
                            <p className="text-xs text-muted-foreground italic">{info.subtitle}</p>
                          </>
                        ) : (
                          <p className="text-muted-foreground">Muster {p}</p>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card className="border-border">
            <CardContent className="p-8 text-center text-muted-foreground">
              <p className="text-sm">Keine Auswertung verfügbar.</p>
            </CardContent>
          </Card>
        )}
      </div>
      <AppFooter />
    </div>
  );
}
