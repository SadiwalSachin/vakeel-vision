import { QueryClient } from "@tanstack/react-query";

/**
 * Singleton TanStack Query client.
 * Configure stale time, retry logic, and error behaviour here.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: unknown) => {
        // Do not retry on 401 or 403 — these require user action
        const status = (error as { response?: { status: number } })?.response
          ?.status;
        if (status === 401 || status === 403 || status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
