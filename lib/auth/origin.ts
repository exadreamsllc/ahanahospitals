/**
 * Resolves the public origin used to build Supabase email redirect URLs.
 *
 * Prefers NEXT_PUBLIC_SITE_URL (set this in production so confirmation emails
 * always point at the canonical domain), then falls back to the forwarded
 * request headers for local development and preview deployments.
 */

import { headers } from "next/headers";

export async function getSiteOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host") ??
    headerList.get("host") ??
    "localhost:3000";
  const protocol =
    headerList.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return `${protocol}://${host}`;
}

/** Builds an absolute URL for a Supabase email redirect target. */
export async function absoluteUrl(path: string): Promise<string> {
  const origin = await getSiteOrigin();
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
