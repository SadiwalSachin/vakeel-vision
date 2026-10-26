
import Link from "next/link";
import {
  Scale,
  LayoutDashboard,
  Files,
  Settings,
  HelpCircle,
  Search,
  Bell,
  ChevronDown,
  Plus,
} from "lucide-react";

import {
  APP_NAME,
  APP_TAGLINE,
} from "@/constants/app.constants";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Documents",
    href: "/documents",
    icon: Files,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
          {/* Brand */}
          <Link
            href="/"
            className="flex h-[76px] items-center gap-3 border-b border-border px-6"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Scale className="h-5 w-5 text-primary-foreground" />
            </div>

            <div className="min-w-0">
              <p className="text-base font-semibold tracking-tight">
                {APP_NAME}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {APP_TAGLINE}
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex-1 px-4 py-7">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Workspace
            </p>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === "/dashboard";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {item.label}
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <p className="mb-3 mt-9 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Preferences
            </p>

            <nav className="space-y-1">
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Settings className="h-[18px] w-[18px]" />
                Settings
              </Link>
            </nav>
          </div>

          {/* Help card */}
          <div className="m-4 rounded-xl border border-border bg-muted/40 p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-background">
              <HelpCircle className="h-4 w-4 text-primary" />
            </div>

            <p className="text-sm font-medium">Need some help?</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Learn how to organize and analyze your legal documents.
            </p>

            <p className="mt-3 text-xs font-medium text-primary">
              Help center
            </p>
          </div>

          <div className="border-t border-border px-6 py-4">
            <p className="text-xs text-muted-foreground">
              AI-powered legal document intelligence
            </p>
          </div>
        </aside>

        {/* Main application area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top navigation */}
          <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between gap-4 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-9">
            <div className="min-w-0">
              <p className="text-sm font-medium">Workspace</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your legal document workspace
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden h-10 w-64 items-center gap-2 rounded-lg border border-border bg-card px-3 lg:flex">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Search documents...
                </span>
                <span className="ml-auto rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  /
                </span>
              </div>

              <button
                type="button"
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>

              <div className="hidden h-8 w-px bg-border sm:block" />

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  VV
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium">My Account</p>
                  <p className="text-xs text-muted-foreground">
                    Personal workspace
                  </p>
                </div>

                <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 px-4 py-7 sm:px-6 sm:py-9 lg:px-9">
            {children}
          </main>

          <footer className="border-t border-border px-6 py-4 lg:px-9">
            <p className="text-xs text-muted-foreground">
              © 2026 {APP_NAME}. AI-generated insights are informational
              and do not constitute legal advice.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
