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
import { Shield, Users, RotateCcw, Lock, Eye, EyeOff, RefreshCw, UserCog, LayoutDashboard, FlaskConical, CheckCircle2, AlertTriangle, Heart, ChevronDown, ChevronUp } from "lucide-react";
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
                  Bitte gib das Admin-Passwort ein.
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

  const deleteUser = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("Nutzer und alle zugehörigen Daten wurden gelöscht.");
      utils.admin.listUsers.invalidate();
    },
    onError: (err) => toast.error(err.message || "Fehler beim Löschen."),
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

                      {/* Nutzer löschen */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={deleteUser.isPending}
                            className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                            Löschen
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Nutzer endgültig löschen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              <strong>{user.name || "Dieser Nutzer"}</strong> ({user.email}) wird zusammen mit
                              allen Testzyklen, Tageseinträgen und Coach-Freigaben unwiderruflich gelöscht.
                              Diese Aktion kann nicht rückgängig gemacht werden.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteUser.mutate({ adminPassword, userId: user.id })}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Ja, endgültig löschen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

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
        <AdminCoachSection adminPassword={adminPassword} />

        {/* Hinweis */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Das Admin-Panel ist nur für autorisierte Personen zugänglich. Alle Aktionen werden serverseitig mit dem Admin-Passwort verifiziert.
        </p>
      </div>
      <AppFooter />
    </div>
  );
}

// ─── Admin Coach Section ─────────────────────────────────────────────────────

function AdminCoachSection({ adminPassword }: { adminPassword: string }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{ userId: number; cycleId: number; name: string } | null>(null);

  const { data: coachGroups, isLoading } = trpc.admin.listAllClients.useQuery(
    { adminPassword },
    { enabled: !!adminPassword && expanded }
  );

  return (
    <Card className="mt-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <UserCog className="w-4 h-4" />
            Coach-Bereich – Klientenübersicht
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((v) => !v)}
            className="text-xs"
          >
            {expanded ? (
              <><ChevronUp className="w-4 h-4 mr-1" /> Einklappen</>
            ) : (
              <><ChevronDown className="w-4 h-4 mr-1" /> Klienten anzeigen</>
            )}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Lade Klientendaten …</span>
            </div>
          ) : !coachGroups || coachGroups.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-sm text-muted-foreground">Noch keine Coach-Klienten-Zuordnungen vorhanden.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {coachGroups.map(({ coach, clients }) => (
                <div key={coach?.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                      {coach?.name?.charAt(0) || "C"}
                    </div>
                    <div>
                      <span className="font-medium text-sm text-foreground">{coach?.name || "Unbekannter Coach"}</span>
                      <span className="text-xs text-muted-foreground ml-2">{coach?.email}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium ml-auto">
                      {clients.length} Klient{clients.length !== 1 ? "en" : ""}
                    </span>
                  </div>
                  <div className="space-y-2 pl-9">
                    {clients.map(({ user: client }) => (
                      <ClientRowWithCycles
                        key={client.id}
                        client={client}
                        adminPassword={adminPassword}
                        selectedClient={selectedClient}
                        onSelectClient={setSelectedClient}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ─── Client Row with Cycles ──────────────────────────────────────────────────

type ClientUser = { id: number; name: string | null; email: string | null };

function ClientRowWithCycles({
  client,
  adminPassword,
  selectedClient,
  onSelectClient,
}: {
  client: ClientUser;
  adminPassword: string;
  selectedClient: { userId: number; cycleId: number; name: string } | null;
  onSelectClient: (v: { userId: number; cycleId: number; name: string } | null) => void;
}) {
  const [showCycles, setShowCycles] = useState(false);

  const { data: cycles, isLoading: cyclesLoading } = trpc.admin.listUserCycles.useQuery(
    { adminPassword, userId: client.id },
    { enabled: !!adminPassword && showCycles }
  );

  const isSelected = selectedClient?.userId === client.id;

  return (
    <div className="rounded-lg border border-border bg-muted/20 text-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {client.name?.charAt(0) || "U"}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{client.name || "Unbekannt"}</p>
            <p className="text-xs text-muted-foreground truncate">{client.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs shrink-0"
          onClick={() => setShowCycles((v) => !v)}
        >
          {showCycles ? <ChevronUp className="w-3.5 h-3.5 mr-1" /> : <ChevronDown className="w-3.5 h-3.5 mr-1" />}
          Auswertung
        </Button>
      </div>

      {showCycles && (
        <div className="border-t border-border bg-background px-3 pb-3 pt-2">
          {cyclesLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-2 text-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Lade Zyklen …
            </div>
          ) : !cycles || cycles.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">Noch keine abgeschlossenen Zyklen.</p>
          ) : (
            <div className="space-y-1.5 mt-1">
              {cycles.map((cycle) => (
                <button
                  key={cycle.id}
                  onClick={() =>
                    onSelectClient(
                      isSelected && selectedClient?.cycleId === cycle.id
                        ? null
                        : { userId: client.id, cycleId: cycle.id, name: client.name || "Unbekannt" }
                    )
                  }
                  className={`w-full text-left px-3 py-2 rounded-md border text-xs transition-colors ${
                    selectedClient?.cycleId === cycle.id && isSelected
                      ? "border-primary bg-primary/5 text-primary font-medium"
                      : "border-border hover:bg-muted/40 text-foreground"
                  }`}
                >
                  Zyklus #{cycle.id} – gestartet {new Date(cycle.startDate).toLocaleDateString("de-DE")}
                  {cycle.endDate && (
                    <span className="text-muted-foreground ml-2">
                      · abgeschlossen {new Date(cycle.endDate).toLocaleDateString("de-DE")}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {isSelected && selectedClient && (
            <AdminClientEvalView
              adminPassword={adminPassword}
              userId={selectedClient.userId}
              cycleId={selectedClient.cycleId}
              clientName={selectedClient.name}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Admin Client Evaluation View ────────────────────────────────────────────

function AdminClientEvalView({
  adminPassword,
  userId,
  cycleId,
  clientName,
}: {
  adminPassword: string;
  userId: number;
  cycleId: number;
  clientName: string;
}) {
  const { data, isLoading, error } = trpc.admin.adminClientEvaluation.useQuery(
    { adminPassword, userId, cycleId },
    { enabled: !!adminPassword && !!userId && !!cycleId }
  );

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-4 text-xs mt-3">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Lade Auswertung …
      </div>
    );
  }

  if (error || !data?.evaluation) {
    return (
      <p className="text-xs text-muted-foreground mt-3 py-2">
        Keine Auswertungsdaten verfügbar.
      </p>
    );
  }

  const { evaluation } = data;
  const AREA_LABELS = ["Arbeit", "Erholung", "Soziales", "Körper", "Emotion", "Sinn", "Kontrolle", "Selbstbild"];
  // totalLevel: "low" | "medium" | "high"; areaLevel: "green" | "yellow" | "red"
  const TOTAL_LEVEL_COLORS: Record<string, string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-red-100 text-red-700",
  };
  const AREA_LEVEL_COLORS: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="mt-4 border-t border-border pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground">
          Auswertung – {clientName} · Zyklus #{cycleId}
        </p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TOTAL_LEVEL_COLORS[evaluation.totalLevel] || "bg-muted text-muted-foreground"}`}>
          Gesamtniveau: {evaluation.totalLevel === "low" ? "Niedrig" : evaluation.totalLevel === "medium" ? "Mittel" : "Hoch"}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {AREA_LABELS.map((label, i) => (
          <div key={label} className="rounded-md border border-border bg-background p-2 text-center">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-sm font-bold text-foreground">{evaluation.avgs[i]?.toFixed(1)}</p>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${AREA_LEVEL_COLORS[evaluation.areaLevels[i]] || ""}`}>
              {evaluation.areaLevels[i] === "green" ? "Niedrig" : evaluation.areaLevels[i] === "yellow" ? "Mittel" : "Hoch"}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>Tage erfasst: <strong className="text-foreground">{evaluation.daysCompleted}</strong></span>
        <span>Gesamtscore: <strong className="text-foreground">{evaluation.totalSum.toFixed(1)}</strong></span>
        <span>Muster erkannt: <strong className="text-foreground">{evaluation.patterns.length}</strong></span>
      </div>
    </div>
  );
}
