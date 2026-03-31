import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "verifying" | "success" | "error";

export default function AuthVerify() {
  const [status, setStatus] = useState<Status>("verifying");
  const [errorType, setErrorType] = useState<string | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setErrorType("missing_token");
      setStatus("error");
      return;
    }

    // Token-Verifizierung läuft serverseitig über die Redirect-Route
    // Der Server setzt das Cookie und leitet zu /dashboard weiter.
    // Diese Seite wird nur angezeigt, wenn der Redirect fehlschlägt
    // oder wenn wir den Token clientseitig prüfen wollen.
    // Da der Server direkt redirectet, sollte diese Seite nur bei Fehlern erscheinen.
    const errorParam = params.get("error");
    if (errorParam) {
      setErrorType(errorParam);
      setStatus("error");
    } else {
      // Normaler Fall: Server hat bereits redirected, aber falls wir hier landen,
      // versuchen wir den Verify-Endpoint direkt aufzurufen
      window.location.href = `/api/auth/verify?token=${encodeURIComponent(token)}`;
    }
  }, []);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-lg font-medium text-foreground">Anmeldung wird überprüft…</p>
          <p className="text-sm text-muted-foreground">Einen Moment bitte.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    const messages: Record<string, { title: string; desc: string }> = {
      missing_token: {
        title: "Ungültiger Link",
        desc: "Der Anmeldelink ist unvollständig. Bitte fordere einen neuen Link an.",
      },
      invalid_token: {
        title: "Link abgelaufen oder ungültig",
        desc: "Der Anmeldelink ist abgelaufen (gültig für 45 Minuten) oder wurde bereits verwendet. Bitte fordere einen neuen Link an.",
      },
      server_error: {
        title: "Serverfehler",
        desc: "Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuche es erneut.",
      },
    };

    const msg = messages[errorType || ""] || messages.server_error;

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{msg.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{msg.desc}</p>
          </div>
          <Button onClick={() => navigate("/login")} className="w-full h-11">
            Neuen Anmeldelink anfordern
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
        <p className="text-lg font-medium text-foreground">Anmeldung erfolgreich!</p>
        <p className="text-sm text-muted-foreground">Du wirst weitergeleitet…</p>
      </div>
    </div>
  );
}
