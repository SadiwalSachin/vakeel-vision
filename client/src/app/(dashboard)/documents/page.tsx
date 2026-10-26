
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FileText,
  Search,
  Upload,
  MessageSquareText,
  MoreHorizontal,
  Clock3,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  SlidersHorizontal,
  ArrowUpRight,
  Files,
  Sparkles,
  Plus,
} from "lucide-react";

// Replace this dummy data with your documents hook later.
type DocumentStatus = "ready" | "processing" | "failed";

type DocumentItem = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: DocumentStatus;
  pages: number;
  summary: string;
};

const DUMMY_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-001",
    name: "Rental Agreement.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedAt: "Oct 25, 2026",
    status: "ready",
    pages: 18,
    summary: "Residential lease agreement with rent, deposit, and termination clauses.",
  },
  {
    id: "doc-002",
    name: "Employment Contract.pdf",
    type: "PDF",
    size: "1.8 MB",
    uploadedAt: "Oct 24, 2026",
    status: "ready",
    pages: 12,
    summary: "Employment terms, compensation, confidentiality, and non-compete provisions.",
  },
  {
    id: "doc-003",
    name: "Service Agreement.pdf",
    type: "PDF",
    size: "3.1 MB",
    uploadedAt: "Oct 23, 2026",
    status: "processing",
    pages: 32,
    summary: "Document analysis is underway. Your workspace will be ready shortly.",
  },
  {
    id: "doc-004",
    name: "Non-Disclosure Agreement.pdf",
    type: "PDF",
    size: "940 KB",
    uploadedAt: "Oct 21, 2026",
    status: "failed",
    pages: 8,
    summary: "The document could not be processed. Try processing it again.",
  },
];

const STATUS_CONFIG = {
  ready: {
    label: "Ready to chat",
    icon: CheckCircle2,
    className: "text-emerald-600 bg-emerald-500/10",
  },
  processing: {
    label: "Processing",
    icon: LoaderCircle,
    className: "text-amber-600 bg-amber-500/10",
  },
  failed: {
    label: "Processing failed",
    icon: AlertCircle,
    className: "text-red-600 bg-red-500/10",
  },
};

export default function DocumentsPage() {
  const [documents] = useState(DUMMY_DOCUMENTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | DocumentStatus>("all");

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesSearch =
        document.name.toLowerCase().includes(query) ||
        document.summary.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" || document.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [documents, search, filter]);

  const readyCount = documents.filter(
    (document) => document.status === "ready"
  ).length;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            My documents
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Manage your legal documents, review their analysis, and ask
            questions about their contents.
          </p>
        </div>

        {/* Connect this button to your existing upload flow. */}
        <Link
          href="/documents/upload"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Upload className="h-4 w-4" />
          Upload document
        </Link>
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<Files className="h-5 w-5" />}
          label="Total documents"
          value={documents.length.toString()}
          description="Documents in your workspace"
        />
        <SummaryCard
          icon={<MessageSquareText className="h-5 w-5" />}
          label="Ready to chat"
          value={readyCount.toString()}
          description="Available for document Q&A"
        />
        <SummaryCard
          icon={<Clock3 className="h-5 w-5" />}
          label="Being processed"
          value={documents
            .filter((document) => document.status === "processing")
            .length.toString()}
          description="Analysis in progress"
        />
      </section>

      {/* Search and filters */}
      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your documents..."
              aria-label="Search documents"
              className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="flex h-12 items-center gap-2 rounded-xl border border-border bg-card px-3">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as "all" | DocumentStatus)
              }
              aria-label="Filter documents by status"
              className="min-w-32 bg-transparent text-sm outline-none"
            >
              <option value="all">All documents</option>
              <option value="ready">Ready to chat</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Document list */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-semibold">Your library</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {filteredDocuments.length}{" "}
                {filteredDocuments.length === 1 ? "document" : "documents"}
              </p>
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">
              Newest first
            </span>
          </div>

          {filteredDocuments.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredDocuments.map((document) => {
                const status = STATUS_CONFIG[document.status];
                const StatusIcon = status.icon;

                return (
                  <article
                    key={document.id}
                    className="group flex flex-col gap-4 p-5 transition-colors hover:bg-muted/30 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-medium">
                            {document.name}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${status.className}`}
                          >
                            <StatusIcon
                              className={`h-3.5 w-3.5 ${
                                document.status === "processing"
                                  ? "animate-spin"
                                  : ""
                              }`}
                            />
                            {status.label}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span>{document.type}</span>
                          <span>·</span>
                          <span>{document.size}</span>
                          <span>·</span>
                          <span>{document.pages} pages</span>
                          <span>·</span>
                          <span>Uploaded {document.uploadedAt}</span>
                        </div>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                          {document.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 lg:pl-5">
                      {document.status === "ready" ? (
                        <Link
                          href={`/documents/${document.id}/ask`}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          <MessageSquareText className="h-4 w-4" />
                          Ask document
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : document.status === "processing" ? (
                        <button
                          type="button"
                          disabled
                          className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground opacity-70"
                        >
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Processing
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            // Replace with your retry-processing service.
                            alert(`Retry processing: ${document.name}`);
                          }}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
                        >
                          <AlertCircle className="h-4 w-4" />
                          Retry
                        </button>
                      )}

                      <button
                        type="button"
                        aria-label={`More actions for ${document.name}`}
                        title="More actions"
                        onClick={() =>
                          alert(`Add document actions for ${document.name}`)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">No documents found</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Try another search term or change the status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contextual help */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Your documents, easier to understand</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                Open a processed document to ask questions, understand clauses,
                and explore important details from its contents.
              </p>
            </div>
          </div>
          <Link
            href="/documents/upload"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-muted sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add a document
          </Link>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <span className="text-xs text-muted-foreground">Overview</span>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
