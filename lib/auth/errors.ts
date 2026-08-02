/**
 * Maps Supabase auth errors onto safe, user-facing messages.
 *
 * Raw Supabase error text is never shown to the browser: it can leak account
 * existence, rate-limit internals, and provider configuration. Callers must
 * always route errors through this module.
 */

import type { AuthError } from "@supabase/supabase-js";

export const GENERIC_AUTH_ERROR =
  "We could not complete that request. Please try again in a moment.";

/** Known Supabase error codes mapped to approved copy. */
const SAFE_MESSAGES: Record<string, string> = {
  invalid_credentials: "The email address or password is incorrect.",
  email_not_confirmed:
    "Please confirm your email address first. Check your inbox for the confirmation link.",
  email_address_invalid: "Please enter a valid email address.",
  email_address_not_authorized:
    "That email address cannot be used to register at the moment.",
  weak_password:
    "Please choose a stronger password with at least 8 characters.",
  same_password: "Your new password must be different from your current password.",
  over_request_rate_limit:
    "Too many attempts. Please wait a few minutes and try again.",
  over_email_send_rate_limit:
    "Too many emails requested. Please wait a few minutes and try again.",
  otp_expired:
    "That link has expired. Please request a new one.",
  signup_disabled: "New registrations are temporarily unavailable.",
  session_expired: "Your session has expired. Please sign in again.",
  session_not_found: "Your session has expired. Please sign in again.",
};

/**
 * Returns a message that is safe to render.
 *
 * IMPORTANT: never log or return `error.message` directly, and never log the
 * full auth response — it may contain tokens.
 */
export function toSafeAuthMessage(
  error: AuthError | null,
  fallback: string = GENERIC_AUTH_ERROR
): string {
  if (!error) return fallback;

  if (error.code && SAFE_MESSAGES[error.code]) {
    return SAFE_MESSAGES[error.code];
  }

  if (error.status === 429) {
    return SAFE_MESSAGES.over_request_rate_limit;
  }

  return fallback;
}

/**
 * True when the error indicates the credentials themselves were rejected,
 * as opposed to a transport or configuration failure.
 */
export function isInvalidCredentials(error: AuthError | null): boolean {
  return error?.code === "invalid_credentials" || error?.status === 400;
}

/**
 * Development-only breadcrumb. Logs a stable code and status, never the
 * message body, tokens, passwords, or the full response object.
 */
export function logAuthFailure(context: string, error: AuthError | null): void {
  if (process.env.NODE_ENV === "production" || !error) return;
  console.warn(
    `[auth] ${context} failed (code=${error.code ?? "unknown"}, status=${
      error.status ?? "unknown"
    })`
  );
}
