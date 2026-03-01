import { Link } from "wouter";

export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
          <span>
            © {year} Bernd Sinzig / Burnout LIFEBACK<sup>®</sup> Guide – Selbsttest
          </span>
          <span className="hidden sm:inline text-border">|</span>
          <span className="italic">&bdquo;Erkenne Burnout-Risiken, bevor sie dich einholen&ldquo;</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/impressum" className="hover:text-foreground transition-colors">
            Impressum
          </Link>
          <span className="text-border">|</span>
          <Link href="/datenschutz" className="hover:text-foreground transition-colors">
            Datenschutzerklärung
          </Link>
        </nav>
      </div>
    </footer>
  );
}
