import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@tanstack/react-router";
import { Bell, CheckSquare, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [{ label: "Dashboard", to: "/" }];

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, login, logout, loginStatus } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shadow-sm">
                <CheckSquare className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-foreground text-base tracking-tight">
                Life Admin Tracker
              </span>
            </div>

            {/* Desktop nav */}
            <nav
              className="hidden md:flex items-center gap-1"
              data-ocid="main-nav"
            >
              {isAuthenticated &&
                NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                    activeProps={{ className: "text-foreground bg-muted" }}
                  >
                    {link.label}
                  </Link>
                ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hidden md:flex"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                  </Button>
                  <Separator
                    orientation="vertical"
                    className="h-5 hidden md:block"
                  />
                  <Button
                    data-ocid="logout-btn"
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="hidden md:flex gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                  >
                    {mobileOpen ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Menu className="w-4 h-4" />
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  data-ocid="login-btn"
                  size="sm"
                  onClick={login}
                  disabled={loginStatus === "initializing"}
                  className="font-medium"
                >
                  {loginStatus === "initializing" ? "Signing in…" : "Sign In"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && isAuthenticated && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              >
                {link.label}
              </Link>
            ))}
            <Separator />
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </footer>
    </div>
  );
}

export default Layout;
