/**
 * Auth-related TypeScript types.
 * Derived from FastAPI schemas in server/app/schemas/auth.py
 */

/** Matches UserResponse schema */
export interface User {
  id: number;
  name: string;
  email: string;
  is_email_verified: boolean;
  created_at: string; // ISO datetime string
}

/** Matches RegisterRequest schema */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/** Matches LoginRequest schema */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Matches TokenResponse schema */
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

/** Matches ForgotPasswordRequest schema */
export interface ForgotPasswordRequest {
  email: string;
}

/** Matches ResetPasswordRequest schema */
export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

/** Matches VerifyEmailRequest schema */
export interface VerifyEmailRequest {
  token: string;
}

/** Matches ResendVerificationRequest schema */
export interface ResendVerificationRequest {
  email: string;
}

export type AuthStatus = "authenticated" | "unauthenticated" | "loading";
