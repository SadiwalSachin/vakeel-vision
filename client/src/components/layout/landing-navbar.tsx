"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Scale, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE } from "@/constants/app.constants";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary group-hover:bg-primary/90 transition-colors">
            <Scale className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="font-semibold text-base leading-none text-foreground">
              {APP_NAME}
            </p>
            <p className="text-muted-foreground text-[11px] mt-0.5">
              {APP_TAGLINE}
            </p>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <a
            href="#security"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Security
          </a>
        </div>

        {/* Auth buttons — desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Link href="/login">Log In</Link>
          </Button>
          <Button size="sm">
            <Link href="/register">Sign Up Free</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border px-6 py-5 space-y-4 animate-fade-in">
          <a
            href="#features"
            className="block text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="block text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            How It Works
          </a>
          <a
            href="#security"
            className="block text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Security
          </a>
          <div className="flex gap-3 pt-3 border-t border-border">
            <Button variant="outline" className="flex-1">
              <Link href="/login">Log In</Link>
            </Button>
            <Button className="flex-1">
              <Link href="/register">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
