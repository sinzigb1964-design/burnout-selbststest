import { useState, useMemo } from "react";
import AppFooter from "@/components/AppFooter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Shield, Users, RotateCcw, Lock, Eye, EyeOff, RefreshCw, UserCog, LayoutDashboard, FlaskConical, CheckCircle2, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminPanel() {
  const [, navigate] = useLocation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const verifyPassword = trpc.admin.verifyPassword.useMutation({
    onSuccess: () => {
      setIsAuthenticated(true);
      setAdminPassword(password);
      toast.success("Zugang gewährt.");
    },
    onError: (err) => {
      toast.error(err.message || "Falsches Passwort.");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPassword.mutate({ password });
  };

  // ─── Passwort-Gate ──────────────────────────────────────────────────────────
  // Wichtig: Kein bedingter Return vor Hooks – stattdessen JSX-Bedingung
  return (
    <>
      {!isAuthenticated ? (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Admin-Panel</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Bitte geben Sie das Admin-Passwort ein.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Passwort</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Admin-Passwort eingeben"
                      autoFocus
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!password || verifyPassword.isPending}
                >
                  {verifyPassword.isPending ? (
                    <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Prüfe …</>
                  ) : (
                    <><Lock className="w-4 h-4 mr-2" /> Anmelden</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate("/")}
                >
                  Zurück zur Startseite
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <AdminDashboard adminPassword={adminPassword} onLogout={() => setIsAuthenticated(false)} />
      )}
    </>
  );
}

// ─── Admin Dashboard (nach Authentifizierung) ───────────────────────────────

function AdminDashboard({ adminPassword, onLogout }: { adminPassword: string; onLogout: () => void }) {
  const utils = trpc.useUtils();
  const [, navigate] = useLocation();

  const { data: users, isLoading, refetch } = trpc.admin.listUsers.useQuery(
    { adminPassword },
    { enabled: !!adminPassword }
  );

  const resetCycle = trpc.admin.resetCycle.useMutation({
    onSuccess: () => {
      toast.success("Zyklus erfolgreich zurückgesetzt.");
      utils.admin.listUsers.invalidate();
    },
    onError: (err) => toast.error(err.message || "Fehler beim Zurücksetzen."),
  });

  const setRoles = trpc.admin.setRoles.useMutation({
    onSuccess: () => {
      toast.success("Rollen erfolgreich geändert.");
      utils.admin.listUsers.invalidate();
    },
    onError: (err: { message?: string }) => toast.error(err.message || "Fehler beim Ändern der Rollen."),
  });

  const { data: testModeData, refetch: refetchTestMode } = trpc.admin.getTestMode.useQuery(
    { adminPassword },
    { enabled: !!adminPassword }
  );

  const setTestMode = trpc.admin.setTestMode.useMutation({
    onSuccess: (data) => {
      toast.success(data.testMode
        ? "Test-Modus aktiviert – mehrere Einträge pro Tag erlaubt."
        : "Normaler Betrieb aktiv – 1 Eintrag pro Tag."
      );
      refetchTestMode();
    },
    onError: (err) => toast.error(err.message || "Fehler beim Umschalten."),
  });

  const stats = useMemo(() => {
    if (!users) return null;
    return {
      total: users.length,
      active: users.filter((u) => u.activeCycle).length,
      coaches: users.filter((u) => u.isCoach).length,
      admins: users.filter((u) => u.role === "admin").length,
    };
  }, [users]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Admin-Panel</h1>
              <p className="text-xs text-muted-foreground">Burnout Selbsttest – Verwaltung</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Aktualisieren
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              Abmelden
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-5xl">
        {/* Statistiken */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Nutzer gesamt", value: stats.total, icon: Users },
              { label: "Aktive Zyklen", value: stats.active, icon: RefreshCw },
              { label: "Coaches", value: stats.coaches, icon: UserCog },
              { label: "Admins", value: stats.admins, icon: Shield },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Test-Modus-Schalter */}
        <Card className={`mb-6 border-2 ${
          testModeData?.testMode
            ? "border-amber-300 bg-amber-50/60"
            : "border-green-200 bg-green-50/40"
        }`}>
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  testModeData?.testMode ? "bg-amber-100" : "bg-green-100"
                }`}>
                  <FlaskConical className={`w-5 h-5 ${
                    testModeData?.testMode ? "text-amber-600" : "text-green-600"
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-foreground text-sm">Betriebsmodus</h3>
                    {testModeData?.testMode ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Test-Modus
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Normalbetrieb
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {testModeData?.testMode
                      ? "Test-Modus: Mehrere Einträge pro Tag erlaubt. Tage werden sequenziell vergeben. Nur für interne Tests verwenden."
                      : "Normalbetrieb: 1 Eintrag pro Tag, Tagnummer ergibt sich aus dem Startdatum des Zyklus (14-Tage-Lauf)."}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant={testModeData?.testMode ? "outline" : "default"}
                  className={testModeData?.testMode
                    ? "border-green-300 text-green-700 hover:bg-green-50"
                    : "bg-green-600 hover:bg-green-700 text-white"
                  }
                  disabled={!testModeData?.testMode || setTestMode.isPending}
                  onClick={() => setTestMode.mutate({ adminPassword, enabled: false })}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Normalbetrieb
                </Button>
                <Button
                  size="sm"
                  variant={testModeData?.testMode ? "default" : "outline"}
                  className={testModeData?.testMode
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "border-amber-300 text-amber-700 hover:bg-amber-50"
                  }
                  disabled={testModeData?.testMode || setTestMode.isPending}
                  onClick={() => setTestMode.mutate({ adminPassword, enabled: true })}
                >
                  <FlaskConical className="w-3.5 h-3.5 mr-1.5" />
                  Test-Modus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutzerliste */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4" />
              Alle Nutzer
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                Lade Nutzerdaten …
              </div>
            ) : !users || users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Noch keine Nutzer registriert.</p>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-border bg-muted/30"
                  >
                    {/* Nutzerinfo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground text-sm truncate">
                          {user.name || "Unbekannt"}
                        </span>
                        {user.role === "admin" && (
                          <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-red-100 text-red-700 border-red-200">Admin</span>
                        )}
                        {user.isCoach && (
                          <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-blue-100 text-blue-700 border-blue-200">Coach</span>
                        )}
                        {user.role !== "admin" && !user.isCoach && (
                          <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-gray-100 text-gray-700 border-gray-200">Nutzer</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {user.email || "Keine E-Mail"}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        {user.activeCycle ? (
                          <span className="text-green-600 font-medium">
                            ● Aktiver Zyklus – Tag {user.entryCount} / 14
                          </span>
                        ) : (
                          <span>Kein aktiver Zyklus</span>
                        )}
                        <span>· {user.completedCount} abgeschlossen</span>
                      </div>
                    </div>

                    {/* Aktionen */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {/* Rollen ändern: Checkboxen für Admin und Coach */}
                      <div className="flex items-center gap-3 px-3 py-1.5 rounded-md border border-border bg-background text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                          <Checkbox
                            checked={user.role === "admin"}
                            onCheckedChange={(checked) =>
                              setRoles.mutate({ adminPassword, userId: user.id, isAdmin: !!checked, isCoach: user.isCoach })
                            }
                          />
                          <span>Admin</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                          <Checkbox
                            checked={user.isCoach}
                            onCheckedChange={(checked) =>
                              setRoles.mutate({ adminPassword, userId: user.id, isAdmin: user.role === "admin", isCoach: !!checked })
                            }
                          />
                          <span>Coach</span>
                        </label>
                      </div>

                      {/* Zyklus zurücksetzen */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!user.activeCycle || resetCycle.isPending}
                            className="h-8 text-xs"
                          >
                            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                            Zyklus reset
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Zyklus zurücksetzen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Der aktive Testzyklus von <strong>{user.name || "diesem Nutzer"}</strong> wird
                              vollständig gelöscht – einschließlich aller {user.entryCount} bereits ausgefüllten
                              Tageseinträge. Diese Aktion kann nicht rückgängig gemacht werden.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => resetCycle.mutate({ adminPassword, userId: user.id })}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Ja, zurücksetzen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coach-Bereich */}
        <Card className="mt-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <UserCog className="w-4 h-4" />
              Coach-Bereich
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Hier gelangen Sie zur Coach-Übersicht mit allen freigegebenen Klienten und deren Auswertungen.
            </p>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => navigate("/coach")}
            >
              <Users className="w-4 h-4 mr-2" />
              Meine Klienten anzeigen
            </Button>
          </CardContent>
        </Card>

        {/* Hinweis */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Das Admin-Panel ist nur für autorisierte Personen zugänglich. Alle Aktionen werden serverseitig mit dem Admin-Passwort verifiziert.
        </p>
      </div>
      <AppFooter />
    </div>
  );
}
