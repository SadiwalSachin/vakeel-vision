import Link from "next/link";
import {
  Scale,
  FileText,
  Sparkles,
  MessageSquareText,
  Upload,
  Search,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Eye,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/layout/landing-navbar";
import { APP_NAME, APP_DESCRIPTION } from "@/constants/app.constants";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Legal Analysis Platform
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Analyze legal documents{" "}
              <span className="text-primary">in seconds,</span>
              <br className="hidden sm:block" />
              not hours
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {APP_DESCRIPTION}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button size="lg" className="gap-2 text-base px-8 h-12">
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base px-8 h-12"
              >
                <Link href="/login">Sign In to Dashboard</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Free to get started
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Upload PDFs instantly
              </span>
            </div>
          </div>

          {/* Dashboard preview mockup */}
          <div className="mt-16 lg:mt-20 relative">
            <div className="absolute -inset-4 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-xl border border-border bg-card shadow-2xl shadow-primary/5 overflow-hidden">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <div className="w-3 h-3 rounded-full bg-green-400/70" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-background rounded-md px-4 py-1 text-xs text-muted-foreground border border-border min-w-[200px] text-center">
                    app.vakeelvision.com/dashboard
                  </div>
                </div>
              </div>
              {/* Dashboard preview content */}
              <div className="p-6 lg:p-8 space-y-6">
                {/* Top bar mockup */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Welcome back, John!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Here&apos;s what&apos;s happening with your legal
                      workspace today.
                    </p>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Upload className="h-3.5 w-3.5" />
                    Upload Document
                  </Button>
                </div>
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Documents",
                      value: "12",
                      sub: "↑ 2 this week",
                      color: "text-primary",
                      icon: FileText,
                    },
                    {
                      label: "Analyses Completed",
                      value: "8",
                      sub: "↑ 3 this week",
                      color: "text-orange-500",
                      icon: Sparkles,
                    },
                    {
                      label: "Questions Asked",
                      value: "24",
                      sub: "↑ 5 this week",
                      color: "text-green-500",
                      icon: MessageSquareText,
                    },
                    {
                      label: "Last Activity",
                      value: "2h ago",
                      sub: "Document analyzed",
                      color: "text-purple-500",
                      icon: Zap,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-border bg-background p-4 space-y-1"
                    >
                      <stat.icon
                        className={`h-5 w-5 ${stat.color} mb-2`}
                      />
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-green-600">{stat.sub}</p>
                    </div>
                  ))}
                </div>
                {/* Doc table mockup */}
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="px-4 py-3 flex items-center justify-between border-b border-border bg-muted/30">
                    <p className="font-medium text-sm text-foreground">
                      Recent Documents
                    </p>
                    <span className="text-xs text-primary font-medium cursor-pointer">
                      View all →
                    </span>
                  </div>
                  {[
                    {
                      name: "Employment Contract.pdf",
                      size: "2.4 MB",
                      type: "PDF",
                      time: "2 hours ago",
                      status: "Analyzed",
                    },
                    {
                      name: "Property Agreement.pdf",
                      size: "1.8 MB",
                      type: "PDF",
                      time: "5 hours ago",
                      status: "Analyzed",
                    },
                    {
                      name: "Legal Notice.pdf",
                      size: "956 KB",
                      type: "PDF",
                      time: "1 day ago",
                      status: "Pending",
                    },
                  ].map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {doc.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-xs">
                        <span className="text-muted-foreground hidden sm:block">
                          {doc.time}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium ${
                            doc.status === "Analyzed"
                              ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 mb-4">
              <Zap className="h-3.5 w-3.5" />
              Powerful Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Everything you need for legal document analysis
            </h2>
            <p className="text-muted-foreground text-lg">
              From uploading your first document to getting AI-driven insights,
              Vakeel Vision handles the heavy lifting so you can focus on
              what matters.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Upload,
                title: "Smart Document Upload",
                desc: "Upload PDF files or paste text directly. Our system processes and indexes your documents automatically for instant analysis.",
                color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
              },
              {
                icon: Sparkles,
                title: "AI-Powered Analysis",
                desc: "Get instant summaries, key points, and insights extracted from your legal documents using advanced AI models.",
                color:
                  "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
              },
              {
                icon: MessageSquareText,
                title: "Ask Questions",
                desc: "Chat with your documents naturally. Ask questions in plain language and receive cited, contextual answers grounded in your text.",
                color:
                  "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
              },
              {
                icon: Search,
                title: "Semantic Search",
                desc: "Go beyond keyword matching. Our vector-based search understands meaning and finds relevant passages across all your documents.",
                color:
                  "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
              },
              {
                icon: FileText,
                title: "Document Management",
                desc: "Organize, view, and manage all your legal documents in one place with status tracking and analysis history.",
                color: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
              },
              {
                icon: ShieldCheck,
                title: "Secure & Private",
                desc: "Your documents are encrypted and stored securely. We never share your data. Full JWT-based authentication protects every request.",
                color: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 lg:p-8 hover-lift cursor-default"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} mb-5`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          HOW IT WORKS SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 mb-4">
              <ArrowRight className="h-3.5 w-3.5" />
              Simple Workflow
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Three steps to smarter legal decisions
            </h2>
            <p className="text-muted-foreground text-lg">
              No complex setup or training needed. Get started in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Upload Your Document",
                desc: "Drag and drop a PDF or paste your legal text directly into the platform. We support contracts, agreements, notices, and more.",
                icon: Upload,
              },
              {
                step: "02",
                title: "AI Analyzes & Indexes",
                desc: "Our AI reads, understands, and creates semantic embeddings of your document, preparing it for intelligent analysis and search.",
                icon: Sparkles,
              },
              {
                step: "03",
                title: "Get Insights & Ask Questions",
                desc: "View AI-generated summaries, key legal points, and ask follow-up questions. Every answer is grounded in your actual document text.",
                icon: MessageSquareText,
              },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center group">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
                )}
                <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/5 border-2 border-primary/10 mb-6 group-hover:border-primary/30 transition-colors">
                  <item.icon className="h-10 w-10 text-primary" />
                  <span className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECURITY SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="security" className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 mb-4">
                  <Lock className="h-3.5 w-3.5" />
                  Enterprise-Ready Security
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
                  Your documents stay private and secure
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Legal documents require the highest level of security. We
                  built Vakeel Vision with privacy-first architecture from day
                  one.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  {
                    icon: Lock,
                    title: "End-to-End Encryption",
                    desc: "All data is encrypted in transit and at rest using industry-standard protocols.",
                  },
                  {
                    icon: Eye,
                    title: "Your Data, Your Control",
                    desc: "We never share, sell, or use your documents for training. You can delete your data at any time.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "JWT Authentication",
                    desc: "Every API request is protected with secure token-based authentication with automatic rotation.",
                  },
                  {
                    icon: Server,
                    title: "Secure Infrastructure",
                    desc: "Hosted on enterprise-grade cloud infrastructure with regular security audits.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security illustration — abstract card grid */}
            <div className="relative">
              <div className="absolute -inset-8 bg-primary/5 rounded-3xl blur-3xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                  <ShieldCheck className="h-8 w-8 text-green-500" />
                  <p className="font-semibold text-foreground text-sm">
                    256-bit AES Encryption
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Bank-grade encryption for all stored documents
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-3 mt-8">
                  <Lock className="h-8 w-8 text-primary" />
                  <p className="font-semibold text-foreground text-sm">
                    Token-Based Auth
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JWT with automatic refresh and session management
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-3 -mt-4">
                  <Eye className="h-8 w-8 text-purple-500" />
                  <p className="font-semibold text-foreground text-sm">
                    Access Control
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Role-based permissions and audit logging
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 space-y-3 mt-4">
                  <Server className="h-8 w-8 text-orange-500" />
                  <p className="font-semibold text-foreground text-sm">
                    Secure Cloud
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Enterprise-grade infrastructure with 99.9% uptime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative rounded-2xl bg-primary overflow-hidden px-8 py-16 lg:px-16 lg:py-20 text-center">
            {/* BG decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />
            </div>

            <div className="relative space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Ready to transform your legal workflow?
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Join legal professionals who are saving hours each week with
                AI-powered document analysis. Start for free — no credit card
                required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 text-base px-8 h-12 bg-white text-primary hover:bg-white/90"
                >
                  <Link href="/register">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="gap-2 text-base px-8 h-12 text-white/90 hover:text-white hover:bg-white/10"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>


      <footer className="border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Scale className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">{APP_NAME}</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a
                href="#features"
                className="hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hover:text-foreground transition-colors"
              >
                How It Works
              </a>
              <a
                href="#security"
                className="hover:text-foreground transition-colors"
              >
                Security
              </a>
              <Link
                href="/login"
                className="hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-xs text-muted-foreground">
              © {APP_NAME}. All rights reserved.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              AI-generated analysis is for informational purposes only and does
              not constitute legal advice. Always consult a qualified legal
              professional.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
