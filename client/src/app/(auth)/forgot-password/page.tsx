"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft, SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/schemas/auth.schema";
import { useForgotPassword } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    forgotPassword(values, {
      onSuccess: () => {
        setSubmitted(true);
      },
      onError: (err) => {
        // Note: the backend returns a generic message even on error to avoid
        // leaking account existence. We still show any real HTTP errors.
        toast.error(getErrorMessage(err));
      },
    });
  }

  // ── Submitted state ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center text-center space-y-6 py-4">
          {/* Animated envelope icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/5">
            <SendHorizonal className="h-7 w-7 text-primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Check your email
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              If an account exists for{" "}
              <span className="font-medium text-foreground">
                {getValues("email")}
              </span>
              , you&apos;ll receive a password reset link within a few minutes.
            </p>
          </div>

          <div className="w-full space-y-3 pt-2">
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive it? Check your spam folder or try again with a
              different email.
            </p>
            <Button
              id="forgot-password-try-again"
              variant="outline"
              className="w-full"
              onClick={() => setSubmitted(false)}
            >
              Try a different email
            </Button>
            <Button variant="ghost" className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form state ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Forgot your password?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Enter the email address associated with your account and we&apos;ll
          send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        <div className="space-y-1.5">
          <Label htmlFor="forgot-email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="forgot-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="pl-9"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "forgot-email-error" : undefined}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p
              id="forgot-email-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          id="forgot-password-submit"
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Sending link…" : "Send reset link"}
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
