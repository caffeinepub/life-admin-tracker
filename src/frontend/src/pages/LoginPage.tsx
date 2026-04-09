import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Bell, CheckSquare, Shield } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const FEATURES = [
  {
    icon: Bell,
    title: "Never Miss a Deadline",
    description:
      "Track bills, renewals, and critical documents — all in one organized place.",
  },
  {
    icon: Shield,
    title: "Stay Covered",
    description:
      "Insurance, Aadhaar, passport renewals — get reminded before they expire.",
  },
  {
    icon: CheckSquare,
    title: "Clear Urgency Levels",
    description:
      "Color-coded priorities show overdue tasks, due this week, and upcoming events at a glance.",
  },
];

export default function LoginPage() {
  const { isAuthenticated, login, loginStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shadow-sm">
            <CheckSquare className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-foreground text-base tracking-tight">
            Life Admin Tracker
          </span>
        </div>
      </header>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-card border border-border rounded-xl shadow-lg p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <CheckSquare className="w-7 h-7 text-primary" />
              </div>
            </div>

            <h1 className="text-2xl font-display font-bold text-foreground text-center mb-2 tracking-tight">
              Life Admin Tracker
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed">
              Your personal command center for bills, renewals, and every
              important life task — organized and never forgotten.
            </p>

            <Button
              data-ocid="ii-login-btn"
              className="w-full font-semibold h-11 gap-2"
              onClick={login}
              disabled={loginStatus === "initializing"}
              size="lg"
            >
              {loginStatus === "initializing" ? (
                <>Signing in…</>
              ) : (
                <>
                  Sign in with Internet Identity
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Secure, decentralized authentication — no password required.
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 grid gap-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-3 px-1">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border py-4">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
