import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, CheckCircle2, Heart, Shield, Trash2, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function CoachZugriff() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  const { data: coaches, isLoading: coachesLoading } = trpc.coach.listCoaches.useQuery();
  const { data: myGrants, isLoading: grantsLoading } = trpc.coach.myGrants.useQuery();

  const grantAccess = trpc.coach.grant.useMutation({
    onSuccess: () => {
      toast.success("Zugriff erteilt.");
      utils.coach.myGrants.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const revokeAccess = trpc.coach.revoke.useMutation({
    onSuccess: () => {
      toast.success("Zugriff widerrufen.");
      utils.coach.myGrants.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const grantedCoachIds = new Set(myGrants?.map((g) => g.coach.id) || []);
  const isLoading = coachesLoading || grantsLoading;

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
              <h1 className="text-lg font-bold text-foreground">Coach-Zugriff verwalten</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-2xl">
        {/* Info */}
        <Card className="border-border bg-accent/30 mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Du hast die volle Kontrolle
                </p>
                <p className="text-sm text-muted-foreground">
                  Coaches können deine Testergebnisse nur sehen, wenn du ihnen explizit Zugriff
                  erteilst. Du kannst den Zugriff jederzeit widerrufen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active grants */}
        {myGrants && myGrants.length > 0 && (
          <Card className="border-border mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary" />
                Aktive Freigaben
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {myGrants.map(({ coach, grant }) => (
                <div
                  key={grant.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {coach.name?.charAt(0) || "C"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{coach.name}</p>
                      <p className="text-xs text-muted-foreground">{coach.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 text-xs">Aktiv</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => revokeAccess.mutate({ coachId: coach.id })}
                      disabled={revokeAccess.isPending}
                      title="Zugriff widerrufen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Available coaches */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Verfügbare Coaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : coaches && coaches.length > 0 ? (
              <div className="space-y-2">
                {coaches.map((coach) => {
                  const hasAccess = grantedCoachIds.has(coach.id);
                  return (
                    <div
                      key={coach.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {coach.name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{coach.name}</p>
                          <p className="text-xs text-muted-foreground">{coach.email}</p>
                        </div>
                      </div>
                      {hasAccess ? (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-xs font-medium">Zugriff erteilt</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => grantAccess.mutate({ coachId: coach.id })}
                          disabled={grantAccess.isPending}
                        >
                          Zugriff erteilen
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Noch keine Coaches registriert.</p>
                <p className="text-xs mt-1">
                  Coaches werden vom Administrator freigeschaltet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
