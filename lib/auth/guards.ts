/**
 * Server-side authorisation guards.
 *
 * Every guard calls `supabase.auth.getUser()`, which validates the session
 * against the Supabase Auth server. `getSession()` is deliberately not used
 * for authorisation decisions because it only decodes the local cookie, which
 * a client can forge.
 */

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { ROUTES } from "@/lib/constants/site";
import { loginRedirectFor } from "@/lib/auth/redirects";

/** Returns the verified user, or null when unauthenticated. */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) return null;
  return data.user ?? null;
}

/**
 * Guards a member route. Unauthenticated visitors are sent to the login page
 * with a `next` parameter so they land back where they intended.
 */
export async function requireUser(currentPath: string): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(loginRedirectFor(currentPath));
  }

  return user;
}

/**
 * Guards a recovery-only route. Without a valid recovery session the visitor
 * is sent back to request a fresh reset link.
 */
export async function requireRecoverySession(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`${ROUTES.forgotPassword}?status=link-expired`);
  }

  return user;
}

/** Keeps signed-in users out of the login and register pages. */
export async function redirectIfAuthenticated(
  destination: string = ROUTES.dashboard
): Promise<void> {
  const user = await getCurrentUser();

  if (user) {
    redirect(destination);
  }
}
