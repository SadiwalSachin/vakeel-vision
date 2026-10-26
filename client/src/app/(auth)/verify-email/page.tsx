"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  MailCheck,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useVerifyEmail, useResendVerification } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/utils";

/**
 * /verify-email?token=<raw_token>&email=<email>
 *
 * Two flows:
 *  1. Token in URL  → auto-verify on mount, show result.
 *  2. No token     → show "check your inbox" state with resend option.
 */

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <VerifyEmailPageComponent />
    </Suspense>
  );
}

function VerifyEmailPageComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email") ?? "";

  const { mutate: verifyEmail } = useVerifyEmail();
  const { mutate: resend, isPending: isResending } = useResendVerification();

  type VerifyState = "idle" | "verifying" | "success" | "error";
  const [state, setState] = useState<VerifyState>(token ? "verifying" : "idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-verify when a token is present in the URL
  useEffect(() => {
    if (!token) return;
    setState("verifying");
    verifyEmail(
      { token },
      {
        onSuccess: () => setState("success"),
        onError: (err) => {
          setErrorMsg(getErrorMessage(err));
          setState("error");
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function handleResend() {
    if (!email) {
      toast.error("Email address is missing. Please register again.");
      return;
    }
    resend(
      { email },
      {
        onSuccess: () =>
          toast.success("Verification email sent!", {
            description: "Check your inbox (and spam folder).",
          }),
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );
  }

  // ── Verifying (token present, waiting for API) ───────────────────────────
  if (state === "verifying") {
    return (
      <div className="flex flex-col items-center text-center space-y-6 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Verifying your email
          </h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we confirm your address…
          </p>
        </div>
      </div>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────────
  if (state === "success") {
    return (
      <div className="flex flex-col items-center text-center space-y-6 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Email verified!
          </h2>
          <p className="text-sm text-muted-foreground">
            Your account is ready. Sign in to get started.
          </p>
        </div>
        <Button
          id="verify-email-signin"
          className="w-full"
          onClick={() => router.push("/login")}
        >
          Continue to sign in
        </Button>
      </div>
    );
  }

  // ── Error (token invalid / expired) ─────────────────────────────────────
  if (state === "error") {
    return (
      <div className="flex flex-col items-center text-center space-y-6 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Verification failed
          </h2>
          <p className="text-sm text-muted-foreground">{errorMsg}</p>
        </div>
        <div className="w-full space-y-3">
          {email && (
            <Button
              id="verify-email-resend-after-error"
              className="w-full"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isResending ? "Sending…" : "Resend verification email"}
            </Button>
          )}
          <Button variant="outline" className="w-full">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Idle — "check your inbox" state (no token in URL) ───────────────────
  return (
    <div className="flex flex-col items-center text-center space-y-6 py-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <MailCheck className="h-8 w-8 text-primary" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Check your inbox
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
          We sent a verification link to{" "}
          {email ? (
            <span className="font-medium text-foreground">{email}</span>
          ) : (
            "your email address"
          )}
          . Click the link to activate your account.
        </p>
      </div>

      <div className="w-full space-y-3">
        <Button
          id="verify-email-resend"
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={isResending || !email}
        >
          {isResending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {isResending ? "Sending…" : "Resend verification email"}
        </Button>

        <Button variant="ghost" className="w-full">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Didn&apos;t get the email? Check your spam folder or{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          register with a different address
        </Link>
        .
      </p>
    </div>
  );
}


