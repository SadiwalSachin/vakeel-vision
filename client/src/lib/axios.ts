import axios from "axios";
import { queryClient } from "@/lib/query-client";
import { API_ROUTES } from "@/lib/api-routes";

// 1. Base URL Configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

/**
 * Main Axios instance configured with credentials enabled 
 * so HttpOnly cookies are automatically sent with requests.
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  // Ensure this runs only on the client side (Browser)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

/**
 * Processes all queued requests waiting for a token refresh.
 */
function processQueue(error: unknown, token: string | null = null) {
  pendingQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized and the request hasn't already been retried
    const isUnauthorized = error.response?.status === 401;
    const isRefreshRoute = originalRequest.url?.includes(API_ROUTES.auth.refresh);

    if (!isUnauthorized || originalRequest._retried || isRefreshRoute) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request until it finishes
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Mark request as retried and start the refresh process
    originalRequest._retried = true;
    isRefreshing = true;

    try {
      // Attempt to get a new access token using the HttpOnly refresh cookie
      const { data } = await apiClient.post<{ access_token: string }>(
        API_ROUTES.auth.refresh
      );

      const newToken = data.access_token;
      
      // Save the new token and process any queued requests
      localStorage.setItem("access_token", newToken);
      processQueue(null, newToken);

      // Retry the original failed request with the new token
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);

    } catch (refreshError) {
      // If refresh fails, clear all pending queue requests with the error
      processQueue(refreshError, null);

      // Clear local auth state & cache, then redirect to login
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