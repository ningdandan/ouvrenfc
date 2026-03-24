import type { ActionErrorCode } from "./types";

const RETRYABLE_CODES: ActionErrorCode[] = ["KV_TIMEOUT", "KV_RATE_LIMIT", "INTERNAL_ERROR"];

export function isRetryableError(code?: ActionErrorCode): boolean {
  return code != null && RETRYABLE_CODES.includes(code);
}

export function getErrorMessage(code: ActionErrorCode, fallback?: string): string {
  switch (code) {
    case "INVALID_INPUT":
      return "Input is invalid. Please check and try again.";
    case "UNAUTHORIZED":
      return "Authentication failed. Please verify the PIN.";
    case "NOT_FOUND":
      return "Chip data not found.";
    case "ALREADY_EXISTS":
      return "This chip is already activated.";
    case "KV_TIMEOUT":
      return "Network is slow. Request timed out.";
    case "KV_RATE_LIMIT":
      return "Server is busy. Please retry shortly.";
    case "INTERNAL_ERROR":
      return fallback ?? "Network unstable. Please try again.";
    default:
      return fallback ?? "Request failed. Please try again.";
  }
}
