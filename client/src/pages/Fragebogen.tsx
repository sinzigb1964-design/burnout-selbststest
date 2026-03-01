import { Button } from "@/components/ui/button";
import AppFooter from "@/components/AppFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { ANSWER_LABELS, QUESTIONNAIRE_AREAS } from "../../../shared/questionnaire";
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

type Answers = Record<string, number>;

const initialAnswers = (): Answers => {
  const a: Answers = {};
  for (let b = 1; b <= 8; b++) {
    for (let q = 1; q <= 7; q++) {
      a[`b${b}q${q}`] = 0;
    }
  }
  return a;
};

export default function Fragebogen() {
  const [, navigate] = useLocation();
  const [currentArea, setCurrentArea] = useState(0); // 0-7
  const [answers, setAnswers] = useState<Answers>(initialAnswers());
  const [submitted, setSubmitted] = useState(false);

  const { data: todayData } = trpc.entry.today.useQuery();
  const isTestMode = todayData?.testMode ?? false;
  const utils = trpc.useUtils();

  const submitEntry = trpc.entry.submit.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      utils.entry.today.invalidate();
      utils.cycle.status.invalidate();
      if (data.isComplete) {
        setTimeout(() => navigate(`/auswertung/${data.entry.cycleId}`), 2000);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Fehler beim Speichern.");
    },
  });

  const area = QUESTIONNAIRE_AREAS[currentArea];
  const totalProgress = Math.round(((currentArea) / 8) * 100);
  const isLastArea = currentArea === 7;

  const setAnswer = (key: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const areaAnswers = Array.from({ length: 7 }, (_, i) => answers[`b${area.id}q${i + 1}`] ?? 0);
  const areaComplete = areaAnswers.every((v) => v !== undefined);

  const handleNext = () => {
    if (currentArea < 7) {
      setCurrentArea((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentArea > 0) {
      setCurrentArea((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    // Build the full answer object for the mutation
    const input: Record<string, number> = {};
    for (let b = 1; b <= 8; b++) {
      for (let q = 1; q <= 7; q++) {
        input[`b${b}q${q}`] = answers[`b${b}q${q}`] ?? 0;
      }
    }
    submitEntry.mutate(input as Parameters<typeof submitEntry.mutate>[0]);
  };

  // Already filled today (nur im Normalmodus)
  if (todayData?.entry && !isTestMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Heute bereits ausgefüllt!</h2>
            <p className="text-muted-foreground mb-6">
              Du hast den Fragebogen für heute bereits abgeschlossen. Morgen geht es weiter.
            </p>
            <Button onClick={() => navigate("/dashboard")}>Zum Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Submitted successfully
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Tag {submitEntry.data?.dayNumber || todayData?.dayNumber || ""} abgeschlossen!
            </h2>
            <p className="text-muted-foreground mb-2">
              Sehr gut! Deine Antworten wurden gespeichert.
            </p>
            {submitEntry.data?.isComplete ? (
              <p className="text-primary font-medium text-sm">
                Du hast alle 14 Tage abgeschlossen! Deine Auswertung wird geladen...
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Morgen geht es weiter.</p>
            )}
            <Button className="mt-6" onClick={() => navigate("/dashboard")}>
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
      <div className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground text-sm">
                Tag {todayData?.dayNumber || "?"} von 14
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              Bereich {currentArea + 1} von 8
            </span>
          </div>
          <Progress value={totalProgress} className="h-1.5" />
          {isTestMode && (
            <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 rounded px-2 py-1 text-center">
              ⚡ Test-Modus aktiv – Tagessperre deaktiviert
            </div>
          )}
        </div>
      </div>

      <div className="container py-8 max-w-2xl">
        {/* Area header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {area.id}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{area.title}</h1>
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm bg-muted/50 rounded-lg p-4 border border-border">
            {area.intro}
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {area.questions.map((question, qIdx) => {
            const key = `b${area.id}q${qIdx + 1}`;
            const currentValue = answers[key] ?? 0;
            return (
              <Card key={key} className="border-border">
                <CardContent className="p-5">
                  <p className="text-sm font-medium text-foreground mb-4 leading-relaxed">
                    {qIdx + 1}. {question}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {ANSWER_LABELS.map((label, value) => (
                      <button
                        key={value}
                        onClick={() => setAnswer(key, value)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all text-center ${
                          currentValue === value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <span className="text-lg font-bold">{value}</span>
                        <span className="text-xs capitalize">{label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentArea === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>

          {isLastArea ? (
            <Button
              onClick={handleSubmit}
              disabled={submitEntry.isPending}
              size="lg"
            >
              {submitEntry.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird gespeichert …
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Abschließen & speichern
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Weiter
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Area progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {QUESTIONNAIRE_AREAS.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setCurrentArea(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === currentArea
                  ? "bg-primary"
                  : i < currentArea
                  ? "bg-primary/50"
                  : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
