import { useAuth } from "@/_core/hooks/useAuth";
import AppFooter from "@/components/AppFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import {
  Activity,
  BarChart3,
  Brain,
  CheckCircle2,
  Heart,
  Lock,
  Moon,
  Shield,
  Users,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const handleStart = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "8 Lebensbereiche",
      desc: "Schlaf, Energie, Nervensystem, Konzentration, Körper, Soziales, Sinn und innere Distanz.",
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "14-Tage-Monitoring",
      desc: "Täglich 56 Fragen (8 × 7) für ein präzises Bild deiner Belastung über zwei Wochen.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Automatische Auswertung",
      desc: "Farbkodierte Ergebnisse mit Mustererkennung und bereichsspezifischen Texten.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Coach-Zugriff",
      desc: "Erteile deinem Coach Zugriff auf deine Ergebnisse – vollständig unter deiner Kontrolle.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "DSGVO-konform",
      desc: "Deine Daten gehören dir. Export und Löschung jederzeit möglich.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Sicher & vertraulich",
      desc: "Verschlüsselte Übertragung, kein Verkauf von Daten, kein Tracking.",
    },
  ];

  const areas = [
    { icon: <Moon className="w-5 h-5" />, label: "Schlaf" },
    { icon: <Activity className="w-5 h-5" />, label: "Energie" },
    { icon: <Heart className="w-5 h-5" />, label: "Nervensystem" },
    { icon: <Brain className="w-5 h-5" />, label: "Konzentration" },
    { icon: <Activity className="w-5 h-5" />, label: "Körper" },
    { icon: <Users className="w-5 h-5" />, label: "Soziales" },
    { icon: <CheckCircle2 className="w-5 h-5" />, label: "Sinn & Freude" },
    { icon: <Heart className="w-5 h-5" />, label: "Innere Distanz" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-lg">Selbsttest Burnout Check</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} size="sm">
                Zum Dashboard
              </Button>
            ) : (
              <Button onClick={handleStart} size="sm">
                Jetzt starten
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-background pointer-events-none" />
        <div className="container py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <CheckCircle2 className="w-4 h-4" />
              Evidenzbasiertes 14-Tage-Monitoring
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Erkenne Burnout-Risiken,{" "}
              <span className="text-primary">bevor sie dich einholen.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              Der 14-Tage-Selbsttest erfasst täglich deine Belastung in 8 Lebensbereichen und
              liefert nach zwei Wochen eine präzise, mehrdimensionale Auswertung mit
              Mustererkennung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={handleStart} className="text-base px-8">
                Kostenlos starten
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                className="text-base px-8"
              >
                Wie funktioniert es?
              </Button>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Kostenlos
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" /> DSGVO-konform
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Kein Abo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Areas Preview */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
            8 Bereiche werden täglich erfasst
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {areas.map((area) => (
              <div
                key={area.label}
                className="flex items-center gap-3 bg-card rounded-lg px-4 py-3 border border-border"
              >
                <span className="text-primary">{area.icon}</span>
                <span className="text-sm font-medium text-foreground">{area.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground mb-4">So funktioniert der Test</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              In drei einfachen Schritten zu einer fundierten Selbsteinschätzung.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Täglich ausfüllen",
                desc: "Beantworte jeden Tag 56 Fragen in 8 Bereichen. Das dauert ca. 5–10 Minuten.",
              },
              {
                step: "02",
                title: "14 Tage durchhalten",
                desc: "Nach 14 Tagen hat das System genügend Daten für eine aussagekräftige Analyse.",
              },
              {
                step: "03",
                title: "Auswertung erhalten",
                desc: "Du bekommst eine detaillierte Auswertung mit Mustern, Farben und erklärenden Texten.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-5xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground mb-4">Was der Test bietet</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="bg-primary rounded-2xl p-10 md:p-16 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Bereit für Klarheit?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Starte jetzt deinen persönlichen 14-Tage-Belastungstest. Kostenlos, anonym und
              DSGVO-konform.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={handleStart}
              className="text-base px-10"
            >
              Jetzt starten
            </Button>
          </div>
        </div>
      </section>

      {/* Ein letzter Gedanke */}
      <section className="py-20 bg-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold text-primary-foreground/60 uppercase tracking-widest mb-6">
              Ein letzter Gedanke
            </p>
            <blockquote className="space-y-5">
              <p className="text-2xl md:text-3xl font-bold text-primary-foreground leading-snug">
                Burnout ist keine Schwäche.
              </p>
              <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
                Du bist ein Mensch. Und jeder von uns hat seine Grenzen.
              </p>
              <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
                Bist du bereit, genau hinzuschauen?<br />
                Bist du bereit zu wissen, wo du genau stehst?
              </p>
              <p className="text-2xl md:text-3xl font-bold text-primary-foreground leading-snug pt-2">
                Mach den Selbstcheck nur für dich.
              </p>
            </blockquote>
            <div className="mt-10 flex items-center justify-center gap-3">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663325194886/kUhDEWUQxkuYXEHuB7K7Rz/bernd-sinzig-profilbild_abb6ce9e.jpg"
                alt="Bernd Sinzig"
                className="w-10 h-10 rounded-full object-cover object-top ring-2 ring-primary-foreground/30"
              />
              <div className="text-left">
                <p className="text-sm font-semibold text-primary-foreground">Bernd Sinzig</p>
                <p className="text-xs text-primary-foreground/60">Burnout LIFEBACK<sup>®</sup> Guide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Über Bernd Sinzig */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Wer begleitet dich?</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Bernd Sinzig – Burnout LIFEBACK<sup className="text-base font-normal">®</sup> Guide
              </h2>
            </div>

            {/* Foto + Geschichte */}
            <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
              <div className="flex flex-col items-center md:items-start gap-6">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663325194886/kUhDEWUQxkuYXEHuB7K7Rz/bernd-sinzig-profilbild_abb6ce9e.jpg"
                  alt="Bernd Sinzig – Burnout LIFEBACK® Guide"
                  className="w-56 h-56 rounded-2xl object-cover object-top shadow-lg ring-4 ring-primary/10"
                />
                <div className="text-center md:text-left">
                  <p className="font-bold text-foreground text-lg">Bernd Sinzig</p>
                  <p className="text-muted-foreground text-sm">Burnout LIFEBACK<sup className="text-xs">®</sup> Guide</p>
                  <p className="text-muted-foreground text-sm">Jahrgang 1964 | Bern – Zürich &amp; DACH-Raum</p>
                </div>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-foreground font-semibold text-lg">
                  54 Jahre lang funktioniert – dann kam der Totalausfall.
                </p>
                <p>
                  Arbeit machte Freude, Zeit war vernachlässigbar. Bis zum Zusammenbruch. Ich lag 20
                  Stunden am Tag im Bett.
                  <br /><br />
                  Das war vor 7 Jahren. Als Life- &amp; Business Coach und HR Führungskraft hätte ich es
                  besser wissen müssen.
                </p>
                <p>
                  Nach der Therapie erkannte ich: Ein „Weiter so“ hätte Rückfall bedeutet. Nach
                  Zusatzausbildungen begann ich, Burnout-Betroffene zu begleiten. Zurück ins Leben. Punkt.
                  Bisher ist das bei mehr als 250 Klientinnen und Klienten gelungen.
                </p>
                <p>
                  Vorsorge ist viel leichter als Nachsorge.
                  <br />
                  Aus diesem Grund ist dieser kostenfreie Selbsttest für dich entstanden. Kein Falsch –
                  kein Richtig. Du erhältst ein Ergebnis für dich. Wo stehe ich, kannst du dann für dich
                  beantworten.
                </p>
              </div>
            </div>

            {/* Arbeitsprinzipien */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { title: "Professionalität", desc: "Evidenzbasierte Methoden und klare Grenzen" },
                { title: "Empathie", desc: "Immer in einem sicheren Raum für Fortschritte" },
                { title: "Transparenz", desc: "Klare Ziele, klare Schritte, ehrliche Fragen" },
                { title: "Wirksamkeit", desc: "Im Blick: konkrete, messbare Veränderungen" },
              ].map((p) => (
                <div key={p.title} className="bg-muted/40 rounded-xl p-5 border border-border">
                  <p className="font-semibold text-foreground mb-1">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>

            {/* Zitat + CTA */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <p className="text-foreground font-medium text-lg leading-relaxed italic mb-4">
                  „Jeder Tag, an dem du weisst, es gibt keine Gefahr aus dem System zu kippen,
                  lässt dich in Gesundheit. Vorsorge ist viel besser als Nachsorge.
                  Lüg dir nicht in die eigene Tasche.“
                </p>
                <p className="text-sm text-muted-foreground">Bernd Sinzig</p>
              </div>
              <a
                href="https://zeeg.me/bsinzig/P00U26"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-7 py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-sm"
              >
                Gespräch mit Bernd vereinbaren
              </a>
            </div>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
