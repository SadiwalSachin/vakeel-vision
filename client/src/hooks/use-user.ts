"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { QUERY_KEYS, ACCESS_TOKEN_KEY } from "@/constants/app.constants";

/**
 * Fetch the authenticated user's profile (GET /auth/me).
 * Enabled only when an access token is present.
 */
export function useUserProfile() {
  const hasToken =
    typeof window !== "undefined" &&
    !!localStorage.getItem(ACCESS_TOKEN_KEY);

  return useQuery({
    queryKey: QUERY_KEYS.me,
    queryFn: userService.getProfile,
    enabled: hasToken,
    retry: false,
  });
}
