"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "@/lib/auth/guards";
import { logAuthFailure, toSafeAuthMessage } from "@/lib/auth/errors";
import { ROUTES } from "@/lib/constants/site";
import {
  formError,
  validateNewPassword,
  type FormState,
} from "@/lib/validation/auth";

/**
 * Sets a new password for the user holding a valid recovery session.
 *
 * The session is re-verified server-side with `getUser()` on every submission;
 * the client is never trusted to assert that a recovery link was followed.
 */
export async function resetPasswordAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`${ROUTES.forgotPassword}?status=link-expired`);
  }

  const validation = validateNewPassword(formData);

  if (!validation.ok) {
    return validation.state;
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: validation.data.password,
  });

  if (error) {
    logAuthFailure("updateUser:password", error);
    return formError(
      toSafeAuthMessage(
        error,
        "We could not update your password. Please request a new reset link and try again."
      )
    );
  }

  // Ending the recovery session forces a fresh sign-in with the new password
  // and invalidates the one-time recovery link.
  await supabase.auth.signOut();

  redirect(`${ROUTES.login}?status=password-updated`);
}
