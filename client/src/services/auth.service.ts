/**
 * Auth service — all auth API calls go through this file.
 * Rule: Pages must never call apiClient directly.
 * Rule: Every backend endpoint path must come from api-routes.ts.
 */

import { apiClient } from "@/lib/axios";
import { API_ROUTES } from "@/lib/api-routes";
import type {
  RegisterRequest,
  LoginRequest,
  TokenResponse,
  User,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
} from "@/types/auth.types";
import type { MessageResponse } from "@/types/api.types";

export const authService = {
  /** POST /auth/register */
  register: async (payload: RegisterRequest): Promise<User> => {
    const { data } = await apiClient.post<User>(
      API_ROUTES.auth.register,
      payload
    );
    return data;
  },

  /** POST /auth/login */
  login: async (payload: LoginRequest): Promise<TokenResponse> => {
    const { data } = await apiClient.post<TokenResponse>(
      API_ROUTES.auth.login,
      payload
    );
    return data;
  },

  /** POST /auth/logout */
  logout: async (): Promise<MessageResponse> => {
    const { data } = await apiClient.post<MessageResponse>(
      API_ROUTES.auth.logout
    );
    return data;
  },

  /** GET /auth/me */
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>(API_ROUTES.auth.me);
    return data;
  },

  /** POST /auth/refresh */
  refresh: async (): Promise<TokenResponse> => {
    const { data } = await apiClient.post<TokenResponse>(
      API_ROUTES.auth.refresh
    );
    return data;
  },

  /** POST /auth/verify-email */
  verifyEmail: async (payload: VerifyEmailRequest): Promise<MessageResponse> => {
    const { data } = await apiClient.post<MessageResponse>(
      API_ROUTES.auth.verifyEmail,
      payload
    );
    return data;
  },

  /** POST /auth/resend-verification */
  resendVerification: async (
    payload: ResendVerificationRequest
  ): Promise<MessageResponse> => {
    const { data } = await apiClient.post<MessageResponse>(
      API_ROUTES.auth.resendVerification,
      payload
    );
    return data;
  },

  /** POST /auth/forgot-password */
  forgotPassword: async (
    payload: ForgotPasswordRequest
  ): Promise<MessageResponse> => {
    const { data } = await apiClient.post<MessageResponse>(
      API_ROUTES.auth.forgotPassword,
      payload
    );
    return data;
  },

  /** POST /auth/reset-password */
  resetPassword: async (
    payload: ResetPasswordRequest
  ): Promise<MessageResponse> => {
    const { data } = await apiClient.post<MessageResponse>(
      API_ROUTES.auth.resetPassword,
      payload
    );
    return data;
  },
};
