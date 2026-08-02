"use server";

import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "@/lib/auth/guards";
import { validateCallbackRequest } from "@/lib/validation/contact";
import { formError, type FormState } from "@/lib/validation/auth";

export async function submitCallbackRequestAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validation = validateCallbackRequest(formData);

  if (!validation.ok) {
    return validation.state;
  }

  const { fullName, phoneNumber, preferredTime, contactChannel } = validation.data;

  const values = {
    fullName,
    phoneNumber: formData.get("phoneNumber") as string,
    preferredTime,
    contactChannel,
  };

  try {
    const user = await getCurrentUser();
    const supabase = await createClient();

    const { error } = await supabase.from("callback_requests").insert({
      user_id: user?.id || null,
      full_name: fullName,
      phone_number: phoneNumber,
      preferred_time: preferredTime,
      contact_channel: contactChannel,
      status: "pending",
    });

    if (error) {
      console.error("Database error saving callback request:", error);
      return formError("We could not save your request. Please try again or call us directly.", {}, values);
    }

    return {
      message: "success",
      fieldErrors: {},
      values,
    };
  } catch (e) {
    console.error("Error in submitCallbackRequestAction:", e);
    return formError("An unexpected error occurred. Please try again.", {}, values);
  }
}
