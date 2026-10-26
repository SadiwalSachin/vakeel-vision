/**
 * Generic API response wrapper and shared API types.
 * All types here are derived from the FastAPI backend schemas.
 */

export interface ApiError {
  detail: string | { msg: string; type: string }[];
}

export interface MessageResponse {
  message: string;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}
