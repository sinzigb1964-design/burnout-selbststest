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
import { generatePDF } from "@/lib/generatePdf";
import { ArrowLeft, Download, Heart, Shield, Trash2, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";


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
