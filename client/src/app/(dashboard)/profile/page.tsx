"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, UserRound, ShieldCheck } from "lucide-react";

import { useMe } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isPending, isError } = useMe();

  useEffect(() => {
    if (!isPending && (isError || !user)) {
      router.replace("/login");
    }
  }, [isPending, isError, user, router]);

  // Loading state
  if (isPending || isError || !user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <LoaderCircle className="h-10 w-10 animate-spin text-primary" />

          <div className="space-y-1">
            <p className="font-medium">
              {isPending ? "Loading your profile..." : "Redirecting to login..."}
            </p>
            <p className="text-sm text-muted-foreground">
              {isPending
                ? "Please wait while we fetch your account information."
                : "Your session may have expired. Please sign in again."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <UserRound className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            My Profile
          </h1>
          <p className="text-muted-foreground">
            View your account information.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Full name</p>
            <p className="font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email address</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="mb-2 text-sm text-muted-foreground">
              Email Verification
            </p>

            {user.is_email_verified ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <ShieldCheck className="h-4 w-4" />
                Verified
              </span>
            ) : (
              <Button  size="sm" variant="outline">
                <Link href="/verify-email">Verify Email</Link>
              </Button>
            )}
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-2 text-sm text-muted-foreground">
              Password & Security
            </p>

            <Button  variant="outline" size="sm">
              <Link href="/reset-password">Reset Password</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
