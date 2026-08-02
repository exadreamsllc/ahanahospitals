"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { absoluteUrl } from "@/lib/auth/origin";
import { logAuthFailure, toSafeAuthMessage } from "@/lib/auth/errors";
import { ROUTES } from "@/lib/constants/site";
import {
  formError,
  validateEmailOnly,
  type FormState,
} from "@/lib/validation/auth";

/**
 * Sends a password reset email.
 *
 * The response is identical for registered and unregistered addresses — only
 * genuine transport failures (such as rate limiting) surface an error, so the
 * form cannot be used to discover which addresses have accounts.
 */
export async function forgotPasswordAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validation = validateEmailOnly(formData);

  if (!validation.ok) {
    return validation.state;
  }

  const { email } = validation.data;

  const supabase = await createClient();

  // The recovery link verifies at /auth/confirm, which then forwards the user
  // to the reset form with an active recovery session.
  const redirectTo = await absoluteUrl(
    `${ROUTES.confirm}?next=${encodeURIComponent(ROUTES.resetPassword)}`
  );

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    logAuthFailure("resetPasswordForEmail", error);

    // Rate limiting is the one case worth telling the user about; anything
    // else is reported as success to avoid account enumeration.
    if (error.status === 429) {
      return formError(toSafeAuthMessage(error), {}, { email });
    }
  }

  redirect(`${ROUTES.checkEmail}?mode=reset&email=${encodeURIComponent(email)}`);
}
