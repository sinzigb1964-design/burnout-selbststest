import { Link } from "wouter";

export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>© {year} Bernd Sinzig / LIFEBACK<sup>®</sup> – Burnout Selbsttest</span>
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
