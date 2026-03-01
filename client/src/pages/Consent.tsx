import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, CheckCircle2, Heart, Lock, Shield } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Consent() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [agreed, setAgreed] = useState(false);
  const utils = trpc.useUtils();

  const giveConsent = trpc.auth.giveConsent.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/dashboard");
    },
  });

  const handleConsent = () => {
    if (!agreed) return;
    giveConsent.mutate();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Willkommen, {user?.name || ""}!</h1>
          <p className="text-muted-foreground">
            Bevor du startest, benötigen wir deine Einwilligung zur Datenverarbeitung.
          </p>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" />
              Datenschutz-Einwilligung (Art. 9 DSGVO)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Info boxes */}
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Was wir speichern</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Deine täglich ausgefüllten Fragebogen-Antworten (Skala 0–3), berechnete
                    Bereichssummen und Gesamtscores über 14 Tage.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                <Lock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Wie wir deine Daten schützen</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Alle Daten werden verschlüsselt übertragen (HTTPS) und auf EU-Servern
                    gespeichert. Passwörter werden gehasht. Keine Weitergabe an Dritte.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Deine Rechte</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Du kannst jederzeit alle deine Daten exportieren oder dein Konto mit allen
                    gespeicherten Daten löschen. Coach-Zugriff erteilst und widerrufst du selbst.
                  </p>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-3 rounded-lg border border-yellow-200 bg-yellow-50">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Wichtiger Hinweis</p>
                <p className="text-sm text-yellow-700 mt-0.5">
                  Dieser Test ist kein medizinisches Diagnosewerkzeug. Er dient der persönlichen
                  Reflexion. Bei ernsthaften Beschwerden wende dich bitte an einen Arzt oder
                  Therapeuten.
                </p>
              </div>
            </div>

            {/* Consent checkbox */}
            <div
              className="flex items-start gap-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setAgreed(!agreed)}
            >
              <Checkbox
                id="consent"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(!!v)}
                className="mt-0.5"
              />
              <label htmlFor="consent" className="text-sm text-foreground cursor-pointer leading-relaxed">
                Ich stimme der Verarbeitung meiner Gesundheitsdaten (Fragebogen-Antworten) gemäß
                Art. 9 Abs. 2 lit. a DSGVO zu. Ich habe die{" "}
                <a href="/datenschutz" className="text-primary underline" onClick={(e) => e.stopPropagation()}>
                  Datenschutzerklärung
                </a>{" "}
                gelesen und verstanden. Ich weiß, dass ich diese Einwilligung jederzeit widerrufen
                kann, indem ich mein Konto und alle Daten lösche.
              </label>
            </div>

            <Button
              onClick={handleConsent}
              disabled={!agreed || giveConsent.isPending}
              className="w-full"
              size="lg"
            >
              {giveConsent.isPending ? "Wird gespeichert …" : "Einwilligung erteilen & starten"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
