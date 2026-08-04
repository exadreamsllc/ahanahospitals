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

export async function updateCallbackAction(
  id: string,
  fullName: string,
  phoneNumber: string,
  status: string,
  preferredTime: string,
  createdAt?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createClient();
    const updatePayload: any = {
      full_name: fullName,
      phone_number: phoneNumber,
      status: status,
      preferred_time: preferredTime,
    };

    if (createdAt) {
      updatePayload.created_at = createdAt;
    }

    const { error } = await supabase
      .from("callback_requests")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      console.error("Database error updating callback request:", error);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (e: any) {
    console.error("Error in updateCallbackAction:", e);
    return { success: false, message: e.message };
  }
}

export async function createCallbackAction(
  fullName: string,
  phoneNumber: string,
  preferredTime: string,
  contactChannel: string,
  createdAt: string
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("callback_requests")
      .insert({
        tenant_id: "a7b3c2d4-1a2b-3c4d-5e6f-7a8b9c0d1e2f", // default tenant ID
        full_name: fullName,
        phone_number: phoneNumber,
        preferred_time: preferredTime,
        contact_channel: contactChannel,
        status: "pending",
        created_at: createdAt,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error creating callback request:", error);
      return { success: false, message: error.message };
    }

    return { success: true, data };
  } catch (e: any) {
    console.error("Error in createCallbackAction:", e);
    return { success: false, message: e.message };
  }
}

export async function deleteCallbackAction(
  id: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("callback_requests")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Database error deleting callback request:", error);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (e: any) {
    console.error("Error in deleteCallbackAction:", e);
    return { success: false, message: e.message };
  }
}
