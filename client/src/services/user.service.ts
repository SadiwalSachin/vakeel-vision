/**
 * User service — profile and account operations.
 * Currently wraps the /auth/me endpoint.
 * Extend here when user management endpoints are added to the backend.
 */

import { authService } from "@/services/auth.service";
import type { User } from "@/types/auth.types";

export const userService = {
  /** GET /auth/me — returns the currently authenticated user */
  getProfile: async (): Promise<User> => {
    return authService.getMe();
  },
};
