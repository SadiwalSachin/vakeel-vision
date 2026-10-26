/**
 * Centralized backend API endpoint paths.
 * Every backend route is declared here — no endpoint strings anywhere else.
 * Source of truth: server/app/api/routes/auth.py & documents.py
 */

export const API_ROUTES = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
    refresh: "/auth/refresh",
    verifyEmail: "/auth/verify-email",
    resendVerification: "/auth/resend-verification",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  documents: {
    list: "/documents/",
    create: "/documents/",
    upload: "/documents/upload",
    createFromText: "/documents/text",
    getById: (id: number | string) => `/documents/${id}`,
    update: (id: number | string) => `/documents/${id}`,
    delete: (id: number | string) => `/documents/${id}`,
    content: (id: number | string) => `/documents/${id}/content`,
    ask: (id: number | string) => `/documents/${id}/ask`,
    embeddings: (id: number | string) => `/documents/${id}/embeddings`,
  },
} as const;
