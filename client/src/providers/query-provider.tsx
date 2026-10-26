"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

/**
 * Wraps the application with TanStack Query's QueryClientProvider.
 * Uses the shared singleton queryClient from lib/query-client.ts.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
