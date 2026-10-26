"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { QUERY_KEYS, ACCESS_TOKEN_KEY } from "@/constants/app.constants";
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
} from "@/types/auth.types";

/**
 * Fetch the currently authenticated user from GET /auth/me.
 * Returns undefined when unauthenticated (no access token).
 */
export function useMe() {
  const hasToken =
    typeof window !== "undefined" &&
    !!localStorage.getItem(ACCESS_TOKEN_KEY);

  return useQuery({
    queryKey: QUERY_KEYS.me,
    queryFn: authService.getMe,
    enabled: hasToken,
    retry: false,
  });
}

/** POST /auth/register */
export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
  });
}

/** POST /auth/login — stores the access token in localStorage on success */
export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: (data) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.me });
    },
  });
}

/** POST /auth/logout — clears the token and all cached queries */
export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      qc.clear();
    },
  });
}

/** POST /auth/verify-email */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (payload: VerifyEmailRequest) =>
      authService.verifyEmail(payload),
  });
}

/** POST /auth/resend-verification */
export function useResendVerification() {
  return useMutation({
    mutationFn: (payload: ResendVerificationRequest) =>
      authService.resendVerification(payload),
  });
}

/** POST /auth/forgot-password */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) =>
      authService.forgotPassword(payload),
  });
}

/** POST /auth/reset-password */
export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) =>
      authService.resetPassword(payload),
  });
}
