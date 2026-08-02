"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { logAuthFailure, toSafeAuthMessage } from "@/lib/auth/errors";
import { resolveNextPath } from "@/lib/auth/redirects";
import {
  formError,
  readString,
  validateLogin,
  type FormState,
} from "@/lib/validation/auth";

/**
 * Signs a member in with email and password.
 *
 * On failure the message is intentionally generic — it must not reveal
 * whether the address exists.
 */
export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validation = validateLogin(formData);

  if (!validation.ok) {
    return validation.state;
  }

  const { email, password } = validation.data;

  // `next` is attacker-controllable, so it is validated as a same-origin path.
  const destination = resolveNextPath(readString(formData, "next"));

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    logAuthFailure("signInWithPassword", error);
    return formError(
      toSafeAuthMessage(error, "The email address or password is incorrect."),
      {},
      { email }
    );
  }

  redirect(destination);
}
