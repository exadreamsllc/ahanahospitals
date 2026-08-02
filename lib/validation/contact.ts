import {
  formError,
  readString,
  type ValidationResult,
} from "./auth";

export type CallbackRequestInput = {
  fullName: string;
  phoneNumber: string;
  preferredTime: "morning" | "afternoon" | "evening";
  contactChannel: "phone" | "whatsapp";
};

export function validateCallbackRequest(
  formData: FormData
): ValidationResult<CallbackRequestInput> {
  const fullName = readString(formData, "fullName");
  const rawPhoneNumber = readString(formData, "phoneNumber");
  const phoneNumber = rawPhoneNumber.replace(/[\s\-\(\)\+]/g, ""); // strip formatting
  const preferredTime = readString(formData, "preferredTime");
  const contactChannel = readString(formData, "contactChannel");

  const fieldErrors: Record<string, string> = {};

  if (!fullName) {
    fieldErrors.fullName = "Please enter your name.";
  } else if (fullName.length > 100) {
    fieldErrors.fullName = "Name must be 100 characters or fewer.";
  }

  // Validate phone number: must be 10 to 12 digits after stripping formatting
  if (!rawPhoneNumber) {
    fieldErrors.phoneNumber = "Please enter your contact number.";
  } else if (!/^[0-9]{10,12}$/.test(phoneNumber)) {
    fieldErrors.phoneNumber = "Please enter a valid 10 to 12 digit phone number.";
  }

  if (!preferredTime || !["morning", "afternoon", "evening"].includes(preferredTime)) {
    fieldErrors.preferredTime = "Please select a preferred contact window.";
  }

  if (!contactChannel || !["phone", "whatsapp"].includes(contactChannel)) {
    fieldErrors.contactChannel = "Please select a contact method.";
  }

  const values = {
    fullName,
    phoneNumber: rawPhoneNumber,
    preferredTime,
    contactChannel,
  };

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      state: formError("Please correct the validation errors and try again.", fieldErrors, values),
    };
  }

  return {
    ok: true,
    data: {
      fullName,
      phoneNumber,
      preferredTime: preferredTime as "morning" | "afternoon" | "evening",
      contactChannel: contactChannel as "phone" | "whatsapp",
    },
  };
}
