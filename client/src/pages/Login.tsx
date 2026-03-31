import { useState } from "react";
import { Heart, Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type Step = "form" | "sent";

export default function Login() {
  const [step, setStep] = useState<Step>("form");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim()) {
      setError("Bitte gib deinen Vornamen ein.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-origin": window.location.origin,
        },
        body: JSON.stringify({ email: email.trim(), firstName: firstName.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
        return;
      }

      setStep("sent");
    } catch {
      setError("Verbindungsfehler. Bitte prüfe deine Internetverbindung.");
    } finally {
      setIsLoading(false);
    }
  };

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
          {step === "form" ? (
            <Card className="border-border shadow-lg">
              <CardContent className="p-8">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-7 h-7 text-primary" />
                </div>

                <h1 className="text-2xl font-bold text-foreground text-center mb-2">
                  Anmelden oder registrieren
                </h1>
                <p className="text-muted-foreground text-center text-sm mb-8 leading-relaxed">
                  Gib deinen Vornamen und deine E-Mail ein. Du erhältst sofort einen
                  Anmeldelink – kein Passwort nötig.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1.5">
                      Vorname
                    </label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="z. B. Bernd"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      autoFocus
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                      E-Mail-Adresse
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="deine@email.de"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        Anmeldelink senden
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="mt-6 text-xs text-muted-foreground text-center leading-relaxed">
                  Mit deiner Anmeldung stimmst du der Verarbeitung deiner Daten gemäß unserer{" "}
                  <a href="/datenschutz" className="underline hover:text-foreground">Datenschutzerklärung</a> zu.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-3">
                  E-Mail gesendet!
                </h2>
                <p className="text-muted-foreground mb-2 leading-relaxed">
                  Wir haben einen Anmeldelink an
                </p>
                <p className="font-semibold text-foreground mb-4">{email}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                  gesendet. Klicke auf den Link in der E-Mail, um dich anzumelden.
                  Der Link ist <strong>45 Minuten</strong> gültig.
                </p>

                <div className="p-4 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground text-left space-y-1">
                  <p className="font-medium text-foreground">Keine E-Mail erhalten?</p>
                  <p>Bitte prüfe deinen Spam-Ordner. Absender: <span className="font-mono text-xs">info@insights.burnout-lifeback-guide.online</span></p>
                </div>

                <Button
                  variant="ghost"
                  className="mt-6 text-sm"
                  onClick={() => { setStep("form"); setError(null); }}
                >
                  Andere E-Mail-Adresse verwenden
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Kostenlos
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> DSGVO-konform
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Kein Passwort
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
