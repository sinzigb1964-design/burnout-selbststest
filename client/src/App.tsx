import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Consent from "./pages/Consent";
import Dashboard from "./pages/Dashboard";
import Fragebogen from "./pages/Fragebogen";
import Auswertung from "./pages/Auswertung";
import CoachZugriff from "./pages/CoachZugriff";
import CoachDashboard from "./pages/CoachDashboard";
import CoachKlient from "./pages/CoachKlient";
import Settings from "./pages/Settings";
import { useAuth } from "./_core/hooks/useAuth";
import { getLoginUrl } from "./const";

// Auth guard component
function ProtectedRoute({
  component: Component,
  requireConsent = true,
}: {
  component: React.ComponentType;
  requireConsent?: boolean;
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (requireConsent && user && !user.consentGiven) {
    navigate("/einwilligung");
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/einwilligung">
        {() => {
          const { user, loading, isAuthenticated } = useAuth();
          if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
          if (!isAuthenticated) { window.location.href = getLoginUrl(); return null; }
          if (user?.consentGiven) { window.location.href = "/dashboard"; return null; }
          return <Consent />;
        }}
      </Route>
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/fragebogen">
        {() => <ProtectedRoute component={Fragebogen} />}
      </Route>
      <Route path="/auswertung/:cycleId">
        {() => <ProtectedRoute component={Auswertung} />}
      </Route>
      <Route path="/coach-zugriff">
        {() => <ProtectedRoute component={CoachZugriff} />}
      </Route>
      <Route path="/coach">
        {() => <ProtectedRoute component={CoachDashboard} />}
      </Route>
      <Route path="/coach/klient/:userId">
        {() => <ProtectedRoute component={CoachKlient} />}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRoute component={Settings} />}
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
