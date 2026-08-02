"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { absoluteUrl } from "@/lib/auth/origin";
import { logAuthFailure, toSafeAuthMessage } from "@/lib/auth/errors";
import { ROUTES } from "@/lib/constants/site";
import {
  formError,
  validateRegistration,
  type FormState,
} from "@/lib/validation/auth";

/**
 * Creates an account with Supabase email/password signup.
 *
 * Only safe, non-clinical metadata is stored: display name, preferred
 * language, and an informational account type that has already been coerced
 * onto an allowlist so a crafted request cannot inject a staff or admin role.
 */
export async function registerAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validation = validateRegistration(formData);

  if (!validation.ok) {
    return validation.state;
  }

  const { fullName, email, password, preferredLanguage, accountType } =
    validation.data;

  const supabase = await createClient();

  // Confirmation link lands on our own route handler, which verifies the
  // token and then forwards the member to the dashboard.
  const emailRedirectTo = await absoluteUrl(
    `${ROUTES.confirm}?next=${encodeURIComponent(ROUTES.dashboard)}`
  );

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        full_name: fullName,
        preferred_language: preferredLanguage,
        account_type: accountType,
      },
    },
  });

  if (error) {
    logAuthFailure("signUp", error);
    return formError(
      toSafeAuthMessage(
        error,
        "We could not create your account right now. Please try again in a moment."
      ),
      {},
      { fullName, email, preferredLanguage, accountType }
    );
  }

  // Deliberately identical whether or not the address was already registered:
  // a different response here would let an attacker enumerate accounts.
  redirect(`${ROUTES.checkEmail}?email=${encodeURIComponent(email)}`);
}
