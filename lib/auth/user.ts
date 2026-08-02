/**
 * Safe readers for Supabase user metadata.
 *
 * `user_metadata` is user-writable, so nothing in it may be trusted for
 * authorisation. These helpers coerce values onto known allowlists and are
 * used for display purposes only.
 */

import type { User } from "@supabase/supabase-js";
import {
  coerceAccountType,
  coercePreferredLanguage,
} from "@/lib/validation/auth";
import type { AccountType, PreferredLanguage } from "@/lib/constants/site";

export type AccountMetadata = {
  fullName: string | null;
  email: string | null;
  preferredLanguage: PreferredLanguage;
  /** Informational only — carries no privileges in Batch 1. */
  accountType: AccountType;
  emailConfirmed: boolean;
  createdAt: string | null;
};

function readMetaString(user: User, key: string): string {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const value = metadata?.[key];
  return typeof value === "string" ? value.trim() : "";
}

export function readAccountMetadata(user: User): AccountMetadata {
  const fullName = readMetaString(user, "full_name");

  return {
    fullName: fullName || null,
    email: user.email ?? null,
    preferredLanguage: coercePreferredLanguage(
      readMetaString(user, "preferred_language")
    ),
    accountType: coerceAccountType(readMetaString(user, "account_type")),
    emailConfirmed: Boolean(user.email_confirmed_at),
    createdAt: user.created_at ?? null,
  };
}

/** Preferred greeting: full name, else the local part of the email. */
export function getDisplayName(user: User): string {
  const { fullName, email } = readAccountMetadata(user);
  if (fullName) return fullName;
  if (email) return email.split("@")[0];
  return "there";
}

export function formatJoinedDate(isoDate: string | null): string | null {
  if (!isoDate) return null;
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
