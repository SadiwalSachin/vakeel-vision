import axios from "axios";
import { queryClient } from "@/lib/query-client";
import { API_ROUTES } from "@/lib/api-routes";

/**
 * Centralized Axios instance.
 * - Base URL is read from the NEXT_PUBLIC_API_URL environment variable.
 * - Attaches the access token from localStorage on every request.
 * - On 401, attempts a silent token refresh via the HttpOnly cookie.
 * - If refresh fails, clears auth state and redirects to /login.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send the HttpOnly refresh-token cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor ─────────────────────────────────────────────────────
// Attach the access token from localStorage (if present) to every request.
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response interceptor ────────────────────────────────────────────────────
// On 401, attempt a silent token refresh. If the refresh succeeds, replay the
// original request once. If it fails, sign the user out.

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, and only once per request
    if (error.response?.status !== 401 || originalRequest._retried) {
      return Promise.reject(error);
    }

    // Skip the refresh endpoint itself to prevent infinite loops
    if (originalRequest.url?.includes(API_ROUTES.auth.refresh)) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retried = true;
    isRefreshing = true;

    try {
      const { data } = await apiClient.post<{ access_token: string }>(
        API_ROUTES.auth.refresh
      );
      const newToken = data.access_token;
      localStorage.setItem("access_token", newToken);
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      // Clear local auth state and redirect to login
      localStorage.removeItem("access_token");
      queryClient.clear();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
