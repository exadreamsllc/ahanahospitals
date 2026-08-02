/**
 * Open-redirect protection for user-supplied `next` parameters.
 *
 * Any value that reaches a redirect target must pass through `safeNextPath`.
 * Without it, `/auth/login?next=https://evil.example` would bounce a freshly
 * authenticated user off-site.
 */

import { ROUTES } from "@/lib/constants/site";

/**
 * Accepts only same-origin absolute paths.
 *
 * Rejected: absolute URLs, protocol-relative `//host` paths, backslash
 * variants that some browsers normalise to `//`, and control characters.
 */
export function safeNextPath(value: string | null | undefined): string | null {
  if (!value) return null;

  const candidate = value.trim();

  if (!candidate.startsWith("/")) return null;
  if (candidate.startsWith("//") || candidate.startsWith("/\\")) return null;
  if (/[\u0000-\u001f\u007f]/.test(candidate)) return null;

  return candidate;
}

/** Resolves a `next` parameter, falling back to the dashboard. */
export function resolveNextPath(
  value: string | null | undefined,
  fallback: string = ROUTES.dashboard
): string {
  return safeNextPath(value) ?? fallback;
}

/** Builds the login URL that an unauthenticated visitor should be sent to. */
export function loginRedirectFor(pathname: string): string {
  const next = safeNextPath(pathname);
  return next
    ? `${ROUTES.login}?next=${encodeURIComponent(next)}`
    : ROUTES.login;
}
