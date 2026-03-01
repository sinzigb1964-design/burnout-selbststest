import { useAuth } from "@/_core/hooks/useAuth";
import AppFooter from "@/components/AppFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, BarChart3, Heart, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function CoachDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: clients, isLoading } = trpc.coach.myClients.useQuery();

  if (!user?.isCoach && user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <p className="text-muted-foreground">Kein Zugriff. Nur für Coaches.</p>
            <Button className="mt-4" onClick={() => navigate("/dashboard")}>
              Zum Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <h1 className="text-lg font-bold text-foreground">Meine Klienten</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-3xl">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : clients && clients.length > 0 ? (
          <div className="space-y-3">
            {clients.map(({ user: client, access }) => (
              <Card key={client.id} className="border-border hover:shadow-sm transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {client.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Freigabe seit{" "}
                          {new Date(access.grantedAt).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/coach/klient/${client.id}`)}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Ergebnisse
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h3 className="font-semibold text-foreground mb-2">Noch keine Klienten</h3>
              <p className="text-sm text-muted-foreground">
                Sobald Nutzer dir Zugriff auf ihre Ergebnisse erteilen, erscheinen sie hier.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      <AppFooter />
    </div>
  );
}
