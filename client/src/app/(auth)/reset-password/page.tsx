"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/schemas/auth.schema";
import { useResetPassword } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/utils";

/**
 * /reset-password?token=<raw_token>
 *
 * The raw token is read from the URL query param and sent to the backend.
 * The backend hashes it before comparing — we never store or hash it client-side.
 */
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      }
    >
      <ResetPasswordFormComponent />
    </Suspense>
  );
}

function ResetPasswordFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { mutate: resetPassword, isPending } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPassword = watch("new_password", "");

  // ── Missing token state ─────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="flex flex-col items-center text-center space-y-6 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Invalid reset link
          </h2>
          <p className="text-sm text-muted-foreground">
            This password reset link is missing or malformed. Please request a
            new one.
          </p>
        </div>
        <Button className="w-full">
          <Link href="/forgot-password">Request new link</Link>
        </Button>
      </div>
    );
  }

  // ── Success state ──
  if (success) {
    return (
      <div className="flex flex-col items-center text-center space-y-6 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Password reset!
          </h2>
          <p className="text-sm text-muted-foreground">
            Your password has been changed. All active sessions have been signed
            out.
          </p>
        </div>
        <Button
          id="reset-password-signin"
          className="w-full"
          onClick={() => router.push("/login")}
        >
          Continue to sign in
        </Button>
      </div>
    );
  }

  // ── Form state ───────────────────────────────────────────────────────────
  function onSubmit(values: ResetPasswordFormValues) {
    if (!token) return;
    resetPassword(
      { token, new_password: values.new_password },
      {
        onSuccess: () => setSuccess(true),
        onError: (err) => {
          const msg = getErrorMessage(err);
          if (
            msg.toLowerCase().includes("expired") ||
            msg.toLowerCase().includes("invalid")
          ) {
            toast.error("Reset link has expired or is invalid.", {
              description: "Please request a new password reset link.",
              action: {
                label: "Request new link",
                onClick: () => router.push("/forgot-password"),
              },
              duration: 8000,
            });
          } else {
            toast.error(msg);
          }
        },
      },
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Reset your password
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter a new password for your account. It must be at least 8
          characters.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* New password */}
        <div className="space-y-1.5">
          <Label htmlFor="reset-new-password">New password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="reset-new-password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className="pl-9 pr-10"
              aria-invalid={!!errors.new_password}
              aria-describedby={
                errors.new_password ? "reset-new-password-error" : undefined
              }
              {...register("new_password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.new_password && (
            <p
              id="reset-new-password-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.new_password.message}
            </p>
          )}
          {/* Strength indicator */}
          {newPassword.length > 0 && (
            <div className="flex gap-1 mt-1" aria-label="Password strength">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    newPassword.length >= [4, 8, 10, 12][i]
                      ? i < 2
                        ? "bg-destructive"
                        : i === 2
                          ? "bg-yellow-400"
                          : "bg-green-500"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <Label htmlFor="reset-confirm-password">Confirm new password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="reset-confirm-password"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className="pl-9 pr-10"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword
                  ? "reset-confirm-password-error"
                  : undefined
              }
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p
              id="reset-confirm-password-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          id="reset-password-submit"
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Resetting password…" : "Reset password"}
        </Button>
      </form>

      {/* Back link */}
      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
