import { CheckCircle2, XCircle, AlertCircle, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

type Status = "success" | "invalid" | "error" | "unknown";

function getStatus(search: string): Status {
  const params = new URLSearchParams(search);
  const s = params.get("status");
  if (s === "success" || s === "invalid" || s === "error") return s;
  return "unknown";
}

export default function Abmeldung() {
  const [location] = useLocation();
  // wouter gibt nur den Pfad zurück; window.location.search für Query-Params
  const status = getStatus(window.location.search);

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/10 to-background flex flex-col">
      {/* Header */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container flex items-center h-16">
          <a href="/" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Burnout Selbsttest</span>
          </a>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-border shadow-lg">
            <CardContent className="p-8 text-center">
              {isSuccess ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-3">
                    Erfolgreich abgemeldet
                  </h1>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Du erhältst ab sofort keine automatischen Erinnerungs-E-Mails mehr
                    für den Burnout Selbsttest.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    Dein Konto und alle deine Daten bleiben erhalten. Du kannst dich
                    jederzeit wieder anmelden und den Test fortsetzen oder neu starten.
                  </p>
                </>
              ) : status === "invalid" ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-3">
                    Link ungültig
                  </h1>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    Dieser Abmeldelink ist ungültig oder wurde bereits verwendet.
                    Bitte nutze den Link direkt aus der E-Mail.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-3">
                    Fehler aufgetreten
                  </h1>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    Bei der Abmeldung ist ein Fehler aufgetreten. Bitte versuche es
                    erneut oder kontaktiere uns direkt.
                  </p>
                </>
              )}

              <div className="space-y-3">
                <Button asChild className="w-full">
                  <a href="/">Zur Startseite</a>
                </Button>
                {isSuccess && (
                  <Button variant="outline" asChild className="w-full">
                    <a href="/login">Zum Test anmelden</a>
                  </Button>
                )}
              </div>

              <p className="mt-6 text-xs text-muted-foreground leading-relaxed">
                Fragen? Schreib uns an{" "}
                <a
                  href="mailto:info@insights.burnout-lifeback-guide.online"
                  className="underline hover:text-foreground"
                >
                  info@insights.burnout-lifeback-guide.online
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
