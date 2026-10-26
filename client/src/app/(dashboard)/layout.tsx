"use client";

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
  UserRound,
  Upload,
} from "lucide-react";

import { APP_NAME, APP_TAGLINE } from "@/constants/app.constants";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navigation = [
  {
    section: "Workspace",
    items: [
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
      {
        label: "Upload Document",
        href: "/documents/upload",
        icon: Upload,
      },
    ],
  },
  {
    section: "Account",
    items: [
      {
        label: "My Profile",
        href: "/profile",
        icon: UserRound,
      },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background text-foreground">
      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="hidden h-full w-64 shrink-0 flex-col overflow-hidden border-r border-border bg-card md:flex">
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
          <nav className="flex-1 space-y-7 px-4 py-6">
            {navigation.map((group) => (
              <div key={group.section}>
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.section}
                </p>

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;

                    // Match the exact page or its nested routes.

                    const isActive =
                      item.href === "/documents"
                        ? pathname === "/documents" ||
                          (pathname.startsWith("/documents/") &&
                            pathname !== "/documents/upload" &&
                            !pathname.startsWith("/documents/upload/"))
                        : item.href === "/dashboard"
                          ? pathname === "/dashboard"
                          : pathname === item.href ||
                            pathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 shrink-0 transition-colors",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground",
                          )}
                        />

                        <span>{item.label}</span>

                        {isActive && (
                          <span className="ml-auto h-5 w-1 rounded-full bg-primary" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Help card */}
          <div className="m-4 rounded-xl border border-border bg-muted/40 p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-background">
              <HelpCircle className="h-4 w-4 text-primary" />
            </div>

            <p className="text-sm font-medium">Need some help?</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Learn how to organize and analyze your legal documents.
            </p>

            <p className="mt-3 text-xs font-medium text-primary">Help center</p>
          </div>

          <div className="border-t border-border px-6 py-4">
            <p className="text-xs text-muted-foreground">
              AI-powered legal document intelligence
            </p>
          </div>
        </aside>

        {/* Main application area */}
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {/* Top navigation */}
          <header className="z-20 flex h-[76px] shrink-0 items-center justify-between gap-4 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-9">
            <div className="min-w-0">
              <p className="text-sm font-medium">Workspace</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your legal document workspace
              </p>
            </div>
            {/* 
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
              </button>
            </div> */}
          </header>

          {/* Page content */}
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-7 sm:px-6 sm:py-9 lg:px-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
