import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  Files,
  FileCheck2,
  Clock3,
  ShieldCheck,
  Upload,
  Sparkles,
  MoreHorizontal,
  FileSearch,
} from "lucide-react";

const stats = [
  {
    label: "Total documents",
    value: "12",
    description: "Across your workspace",
    icon: Files,
  },
  {
    label: "Analyzed documents",
    value: "08",
    description: "Analysis completed",
    icon: FileCheck2,
  },
  {
    label: "Awaiting analysis",
    value: "04",
    description: "Ready for review",
    icon: Clock3,
  },
];

const recentDocuments = [
  {
    name: "Service Agreement.pdf",
    type: "Service Agreement",
    date: "Oct 24, 2026",
    status: "Analyzed",
    size: "1.8 MB",
  },
  {
    name: "Rental Contract.pdf",
    type: "Rental Agreement",
    date: "Oct 23, 2026",
    status: "Analyzed",
    size: "920 KB",
  },
  {
    name: "Employment Terms.pdf",
    type: "Employment Contract",
    date: "Oct 22, 2026",
    status: "Processing",
    size: "2.4 MB",
  },
  {
    name: "NDA Agreement.pdf",
    type: "Non-disclosure Agreement",
    date: "Oct 21, 2026",
    status: "Uploaded",
    size: "640 KB",
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Analyzed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Processing: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    Uploaded: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Your legal workspace
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Manage your documents, review important clauses, and prepare for
            your next legal decision.
          </p>
        </div>

        <Link
          href="/documents/upload"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Upload className="h-4 w-4" />
          Upload document
        </Link>
      </section>

      {/* Welcome / upload hero */}
      <section className="relative overflow-hidden rounded-2xl border border-primary/15 bg-primary/[0.04]">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-primary/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-10">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered document intelligence
            </div>

            <h2 className="max-w-xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              Understand your legal documents with greater clarity.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Start with a PDF. Vakeel Vision helps you organize legal documents
              and, as analysis features become available, understand clauses and
              potential risks.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/documents/upload"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Upload className="h-4 w-4" />
                Upload a PDF
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/documents"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                View documents
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Private workspace
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" />
                PDF-focused workflow
              </span>
            </div>
          </div>

          {/* Decorative document preview */}
          <div className="hidden lg:flex lg:justify-end">
            <div className="w-full max-w-[310px] rotate-2 rounded-2xl border border-border bg-background p-5 shadow-xl shadow-primary/[0.06]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <FileSearch className="h-5 w-5 text-primary" />
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                  DOCUMENT PREVIEW
                </span>
              </div>

              <div className="space-y-2">
                <div className="h-2.5 w-3/4 rounded bg-foreground/10" />
                <div className="h-2 w-full rounded bg-muted" />
                <div className="h-2 w-11/12 rounded bg-muted" />
                <div className="h-2 w-4/5 rounded bg-muted" />
              </div>

              <div className="my-5 rounded-lg border border-primary/15 bg-primary/[0.04] p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium">
                    Analysis workspace
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded bg-primary/10" />
                  <div className="h-2 w-4/5 rounded bg-primary/10" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-2 w-full rounded bg-muted" />
                <div className="h-2 w-5/6 rounded bg-muted" />
                <div className="h-2 w-2/3 rounded bg-muted" />
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">
                  Your document workspace
                </span>
                <FileCheck2 className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold">Workspace overview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A quick snapshot of your documents.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/25"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent documents */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-semibold">Recent documents</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your latest documents in one place.
            </p>
          </div>

          <Link
            href="/documents"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile document cards */}
        <div className="divide-y divide-border md:hidden">
          {recentDocuments.map((document) => (
            <div key={document.name} className="space-y-3 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {document.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {document.type}
                  </p>
                </div>

                <MoreHorizontal className="h-5 w-5 shrink-0 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between gap-3">
                <StatusBadge status={document.status} />
                <span className="text-xs text-muted-foreground">
                  {document.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3.5 text-xs font-medium text-muted-foreground">
                  Document
                </th>
                <th className="px-4 py-3.5 text-xs font-medium text-muted-foreground">
                  Date added
                </th>
                <th className="px-4 py-3.5 text-xs font-medium text-muted-foreground">
                  File size
                </th>
                <th className="px-4 py-3.5 text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3.5 text-xs font-medium text-muted-foreground">
                  <span className="sr-only">More options</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {recentDocuments.map((document) => (
                <tr
                  key={document.name}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-medium">{document.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {document.type}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                    {document.date}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground">
                    {document.size}
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={document.status} />
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      aria-label={`More options for ${document.name}`}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-5 py-4 sm:px-6">
          <p className="text-xs text-muted-foreground">
            Sample dashboard content — document counts, dates, and statuses will
            later come from your backend.
          </p>
        </div>
      </section>
    </div>
  );
}
