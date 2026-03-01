import { useAuth } from "@/_core/hooks/useAuth";
import AppFooter from "@/components/AppFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Heart,
  LogOut,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const { data: cycleStatus, isLoading: cycleLoading } = trpc.cycle.status.useQuery();
  const { data: todayData, isLoading: todayLoading } = trpc.entry.today.useQuery();
  const utils = trpc.useUtils();

  const startCycle = trpc.cycle.start.useMutation({
    onSuccess: () => {
      utils.cycle.status.invalidate();
      utils.entry.today.invalidate();
    },
  });

  const activeCycle = cycleStatus?.active;
  const completedCycles = cycleStatus?.completed || [];
  const todayEntry = todayData?.entry;
  const dayNumber = todayData?.dayNumber || 1;

  const progressPercent = activeCycle ? Math.round(((dayNumber - 1) / 14) * 100) : 0;
  const daysCompleted = activeCycle ? dayNumber - 1 : 0;
  const canFillToday = activeCycle && !todayEntry;

  const motivationMessages = [
    "Jeder Tag zählt. Du machst das großartig!",
    "Schon mehr als die Hälfte geschafft. Weiter so!",
    "Du bist fast am Ziel. Noch ein paar Tage!",
    "Fantastisch! Du hast alle 14 Tage abgeschlossen.",
  ];

  const getMotivation = () => {
    if (!activeCycle) return null;
    if (daysCompleted >= 14) return motivationMessages[3];
    if (daysCompleted >= 10) return motivationMessages[2];
    if (daysCompleted >= 7) return motivationMessages[1];
    return motivationMessages[0];
  };

  const isLoading = cycleLoading || todayLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Burnout Selbsttest</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
            <Button variant="ghost" size="icon" onClick={() => navigate("/settings")} title="Einstellungen">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={logout} title="Abmelden">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Guten Tag, {user?.name?.split(" ")[0] || ""}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {activeCycle
              ? `Tag ${dayNumber} von 14 – ${canFillToday ? "Heute noch nicht ausgefüllt." : "Heute bereits ausgefüllt."}`
              : "Starte deinen 14-Tage-Belastungstest."}
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Cycle Card */}
              {activeCycle ? (
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Aktiver Zyklus
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {daysCompleted} / 14 Tage
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Fortschritt</span>
                        <span className="font-medium text-foreground">{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    {/* Day dots */}
                    <div className="grid grid-cols-14 gap-1">
                      {Array.from({ length: 14 }).map((_, i) => {
                        const day = i + 1;
                        const isDone = day < dayNumber;
                        const isToday = day === dayNumber;
                        const isFuture = day > dayNumber;
                        return (
                          <div
                            key={day}
                            className={`h-6 w-full rounded text-xs flex items-center justify-center font-medium transition-colors ${
                              isDone
                                ? "bg-primary text-primary-foreground"
                                : isToday
                                ? canFillToday
                                  ? "bg-yellow-400 text-yellow-900 ring-2 ring-yellow-400/50"
                                  : "bg-primary text-primary-foreground"
                                : isFuture
                                ? "bg-muted text-muted-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>

                    {/* Motivation */}
                    {getMotivation() && (
                      <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 rounded-lg px-3 py-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        {getMotivation()}
                      </div>
                    )}

                    {/* CTA */}
                    {canFillToday ? (
                      <Button
                        className="w-full"
                        onClick={() => navigate("/fragebogen")}
                      >
                        <ClipboardList className="w-4 h-4 mr-2" />
                        Fragebogen für Tag {dayNumber} ausfüllen
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg px-3 py-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Heute bereits ausgefüllt. Morgen geht es weiter.
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-border">
                  <CardContent className="p-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Kein aktiver Zyklus
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                      Starte jetzt deinen 14-Tage-Belastungstest. Fülle täglich den Fragebogen
                      aus und erhalte nach zwei Wochen eine detaillierte Auswertung.
                    </p>
                    <Button
                      onClick={() => startCycle.mutate()}
                      disabled={startCycle.isPending}
                      size="lg"
                    >
                      {startCycle.isPending ? "Wird gestartet …" : "14-Tage-Test starten"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Completed Cycles */}
              {completedCycles.length > 0 && (
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      Abgeschlossene Zyklen
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {completedCycles.map((cycle) => (
                        <div
                          key={cycle.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                          onClick={() => navigate(`/auswertung/${cycle.id}`)}
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Zyklus vom{" "}
                              {new Date(cycle.startDate).toLocaleDateString("de-DE", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Abgeschlossen am{" "}
                              {cycle.endDate
                                ? new Date(cycle.endDate).toLocaleDateString("de-DE")
                                : "–"}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Auswertung
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Quick actions */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Schnellzugriff
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/coach-zugriff")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Coach-Zugriff verwalten
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Einstellungen & DSGVO
                  </Button>
                </CardContent>
              </Card>

              {/* Info */}
              <Card className="border-border bg-accent/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-accent-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-accent-foreground leading-relaxed">
                      Dieser Test ist kein medizinisches Diagnosewerkzeug. Bei ernsthaften
                      Beschwerden wende dich an einen Arzt oder Therapeuten.
                    </p>
                  </div>
                </CardContent>
              </Card>


              {/* Admin-Link – nur für Administratoren sichtbar */}
              {user?.role === "admin" && (
                <Card className="border-destructive/30 bg-destructive/5">
                  <CardContent className="p-4">
                    <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">
                      Administration
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => navigate("/admin")}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin-Panel öffnen
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
      <AppFooter />
    </div>
  );
}
