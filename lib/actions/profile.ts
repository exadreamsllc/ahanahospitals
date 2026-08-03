"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import {
  coerceAccountType,
  coercePreferredLanguage,
  formError,
  MAX_NAME_LENGTH,
  type FormState,
} from "@/lib/validation/auth";

/**
 * Updates the user's profile metadata (full name, preferred language, account type).
 */
export async function updateProfileAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const fullName = formData.get("fullName")?.toString().trim() || "";
  const preferredLanguage = coercePreferredLanguage(
    formData.get("preferredLanguage")?.toString() || ""
  );
  const accountType = coerceAccountType(
    formData.get("accountType")?.toString() || ""
  );

  const fieldErrors: Record<string, string> = {};

  if (!fullName) {
    fieldErrors.fullName = "Please enter your full name.";
  } else if (fullName.length > MAX_NAME_LENGTH) {
    fieldErrors.fullName = `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }

  const values = { fullName, preferredLanguage, accountType };

  if (Object.keys(fieldErrors).length > 0) {
    return formError(
      "Please correct the highlighted fields and try again.",
      fieldErrors,
      values
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      preferred_language: preferredLanguage,
      account_type: accountType,
    },
  });

  if (error) {
    return formError(error.message || "Failed to update profile details.", {}, values);
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return {
    message: "Your profile has been updated successfully.",
    fieldErrors: {},
    values,
  };
}

/**
 * Updates the user's dashboard/reporting preferences.
 */
export async function updatePreferencesAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return formError("You must be logged in to update preferences.");
  }

  // Read the checkbox columns
  const reportColumns = formData.getAll("reportColumns").map((c) => c.toString());

  const preferences = {
    report_columns: reportColumns,
  };

  const { error } = await supabase
    .from("profiles")
    .update({ preferences })
    .eq("id", user.id);

  if (error) {
    return formError(error.message || "Failed to save preferences.");
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return {
    message: "Your display preferences have been saved.",
    fieldErrors: {},
  };
}
