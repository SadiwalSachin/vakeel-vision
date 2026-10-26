import type { Metadata } from "next";
import Link from "next/link";
import { Scale } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/constants/app.constants";

export const metadata: Metadata = {
  title: {
    default: "Sign In",
    template: `%s | ${APP_NAME}`,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] flex-col justify-between relative overflow-hidden bg-primary p-12">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-3 group w-fit">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 group-hover:bg-white/20 transition-colors">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg leading-none">{APP_NAME}</p>
            <p className="text-white/60 text-xs mt-0.5">{APP_TAGLINE}</p>
          </div>
        </Link>

        {/* Hero text */}
        <div className="relative space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              AI-powered legal
              <br />
              document analysis
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm">
              Upload contracts, agreements, and legal notices. Get instant
              AI-generated insights grounded in your documents.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3">
            {[
              "Semantic search across all your documents",
              "Ask questions, get cited answers",
              "PDF upload or paste plain text",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-white/80">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    className="h-2.5 w-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 8 8"
                  >
                    <path d="M1.5 4L3.5 6L6.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom disclaimer */}
        <p className="relative text-white/40 text-xs leading-relaxed max-w-xs">
          AI-generated answers are for informational purposes and do not constitute legal advice. Always consult a qualified professional.
        </p>
      </div>

      {/* ── Right panel — auth form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-background">
        {/* Mobile logo */}
        <Link
          href="/"
          className="lg:hidden flex items-center gap-2 mb-10 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary group-hover:bg-primary/90 transition-colors">
            <Scale className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-base leading-none text-foreground">
              {APP_NAME}
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">{APP_TAGLINE}</p>
          </div>
        </Link>

        {/* Form container */}
        <div className="w-full max-w-[400px] animate-fade-in">{children}</div>
      </div>
    </div>
  );
}
