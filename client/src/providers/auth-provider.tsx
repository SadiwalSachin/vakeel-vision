
"use client";

import { ACCESS_TOKEN_KEY } from "@/constants/app.constants";
import { useMe } from "@/hooks/use-auth";
import { authService } from "@/services/auth.service";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";


type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  setStatus: (status: AuthStatus) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [sessionReady, setSessionReady] = useState(false);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Restore the session once when the app starts.
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const data = await authService.refresh();

        if (cancelled) return;

        localStorage.setItem(
          ACCESS_TOKEN_KEY,
          data.access_token
        );
      } catch {
        if (cancelled) return;

        localStorage.removeItem(ACCESS_TOKEN_KEY);
      } finally {
        if (!cancelled) {
          setSessionReady(true);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // useMe is enabled when the access token exists.
  const {
    data: user,
    isLoading: isMeLoading,
    isError: isMeError,
  } = useMe();

  // Derive auth status after session restoration and profile loading.
  useEffect(() => {
    if (!sessionReady) {
      setStatus("loading");
      return;
    }

    if (user) {
      setStatus("authenticated");
      return;
    }

    if (isMeLoading) {
      setStatus("loading");
      return;
    }

    if (isMeError || !user) {
      setStatus("unauthenticated");
    }
  }, [sessionReady, user, isMeLoading, isMeError]);

  return (
    <AuthContext.Provider value={{ status, setStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
