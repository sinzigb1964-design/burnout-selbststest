import { Button } from "@/components/ui/button";
import AppFooter from "@/components/AppFooter";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function Impressum() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Burnout Selbsttest</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            ← Zurück zur Startseite
          </Button>
        </div>
      </nav>

      <div className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Impressum</h1>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground">

          <section>
            <p className="text-lg font-semibold">Bernd Sinzig / LIFEBACK®</p>
            <p className="text-muted-foreground mt-1">
              c/o payroll-unlimited Inh.: Bernd Sinzig<br />
              Spitalgasse 28<br />
              3011 Bern<br />
              Schweiz
            </p>
          </section>

          <section className="space-y-1">
            <p>
              <span className="font-medium">Telefon:</span>{" "}
              <a href="tel:+41789183095" className="text-primary hover:underline">
                078 918 30 95
              </a>
            </p>
            <p>
              <span className="font-medium">E-Mail:</span>{" "}
              <a href="mailto:info@burnout-lifeback-guide.online" className="text-primary hover:underline">
                info@burnout-lifeback-guide.online
              </a>
            </p>
          </section>

          <section className="space-y-1">
            <p>
              <span className="font-medium">Handelsregister:</span> CH-036.1.093.775-2
            </p>
            <p>
              <span className="font-medium">Registergericht:</span> Kanton Bern
            </p>
            <p>
              <span className="font-medium">Wirtschaftsidentifikationsnummer:</span> CHE-249.217.978
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Redaktionell verantwortlich</h2>
            <p className="text-muted-foreground">
              Bernd Sinzig<br />
              Spitalgasse 28<br />
              3011 Bern
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">EU-Streitschlichtung</h2>
            <p className="text-muted-foreground">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              . Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Verbraucherstreitbeilegung / Universalschlichtungsstelle
            </h2>
            <p className="text-muted-foreground">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Haftungshinweis</h2>
            <p className="text-muted-foreground">
              Diese App dient ausschließlich der persönlichen Selbstreflexion und Sensibilisierung.
              Sie ersetzt keine professionelle medizinische oder psychotherapeutische Diagnose,
              Beratung oder Behandlung. Bei ernsthaften gesundheitlichen Beschwerden wenden Sie
              sich bitte an eine qualifizierte Fachperson.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-border flex gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/datenschutz")}>
            Datenschutzerklärung
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            Zur Startseite
          </Button>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
