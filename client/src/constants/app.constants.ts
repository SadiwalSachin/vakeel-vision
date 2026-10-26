/**
 * Application-wide constants.
 * No magic strings anywhere else in the codebase.
 */

export const APP_NAME = "Vakeel Vision";
export const APP_TAGLINE = "AI for Legal Excellence";
export const APP_DESCRIPTION =
  "AI-powered legal document analysis. Upload PDFs or paste text to get instant insights, summaries, and answers grounded in your documents.";

/** LocalStorage key for the JWT access token */
export const ACCESS_TOKEN_KEY = "access_token";

/** TanStack Query cache keys */
export const QUERY_KEYS = {
  me: ["me"] as const,
  documents: {
    all: ["documents"] as const,
    list: () => [...QUERY_KEYS.documents.all, "list"] as const,
    detail: (id: number | string) =>
      [...QUERY_KEYS.documents.all, "detail", id] as const,
    content: (id: number | string) =>
      [...QUERY_KEYS.documents.all, "content", id] as const,
  },
} as const;

/** Document status display config */
export const DOCUMENT_STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pending", variant: "secondary" },
  uploaded: { label: "Uploaded", variant: "secondary" },
  processed: { label: "Processed", variant: "default" },
  analyzed: { label: "Analyzed", variant: "default" },
  failed: { label: "Failed", variant: "destructive" },
};

/** Accepted file types for document upload */
export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
};

/** Max upload file size: 20 MB */
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

/** Default Q&A top_k value */
export const DEFAULT_TOP_K = 5;

/** Nav links for the sidebar */
export const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Documents", href: "/documents", icon: "FileText" },
  { label: "Analysis", href: "/analysis", icon: "Sparkles", comingSoon: true },
  { label: "Users", href: "/users", icon: "Users", comingSoon: true },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;
