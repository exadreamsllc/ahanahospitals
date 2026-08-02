import { describe, it, expect } from "vitest";
import { validateCallbackRequest } from "@/lib/validation/contact";

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    fd.append(k, v);
  }
  return fd;
}

function validCallback(overrides: Record<string, string> = {}) {
  return form({
    fullName: "Aravind Kumar",
    phoneNumber: "9876543210",
    preferredTime: "morning",
    contactChannel: "whatsapp",
    ...overrides,
  });
}

describe("validateCallbackRequest", () => {
  it("accepts a complete valid submission", () => {
    const result = validateCallbackRequest(validCallback());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.fullName).toBe("Aravind Kumar");
      expect(result.data.phoneNumber).toBe("9876543210");
      expect(result.data.preferredTime).toBe("morning");
      expect(result.data.contactChannel).toBe("whatsapp");
    }
  });

  it("handles and strips phone number formatting correctly", () => {
    const result = validateCallbackRequest(
      validCallback({ phoneNumber: "+91 98765-43210" })
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.phoneNumber).toBe("919876543210");
    }
  });

  it("requires a full name", () => {
    const result = validateCallbackRequest(validCallback({ fullName: "" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.state.fieldErrors.fullName).toBe("Please enter your name.");
    }
  });

  it("rejects names that are too long", () => {
    const longName = "a".repeat(101);
    const result = validateCallbackRequest(validCallback({ fullName: longName }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.state.fieldErrors.fullName).toBe("Name must be 100 characters or fewer.");
    }
  });

  it("rejects empty phone numbers", () => {
    const result = validateCallbackRequest(validCallback({ phoneNumber: "" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.state.fieldErrors.phoneNumber).toBe("Please enter your contact number.");
    }
  });

  it("rejects phone numbers that are too short", () => {
    const result = validateCallbackRequest(validCallback({ phoneNumber: "9876" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.state.fieldErrors.phoneNumber).toBe("Please enter a valid 10 to 12 digit phone number.");
    }
  });

  it("rejects phone numbers with letters", () => {
    const result = validateCallbackRequest(validCallback({ phoneNumber: "98765abcde" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.state.fieldErrors.phoneNumber).toBe("Please enter a valid 10 to 12 digit phone number.");
    }
  });

  it("rejects invalid preferred times", () => {
    const result = validateCallbackRequest(validCallback({ preferredTime: "midnight" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.state.fieldErrors.preferredTime).toBe("Please select a preferred contact window.");
    }
  });

  it("rejects invalid contact channels", () => {
    const result = validateCallbackRequest(validCallback({ contactChannel: "carrier-pigeon" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.state.fieldErrors.contactChannel).toBe("Please select a contact method.");
    }
  });

  it("echoes back safe fields on error", () => {
    const result = validateCallbackRequest(
      form({
        fullName: "Pradeep",
        phoneNumber: "",
        preferredTime: "evening",
        contactChannel: "phone",
      })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.state.values?.fullName).toBe("Pradeep");
      expect(result.state.values?.preferredTime).toBe("evening");
      expect(result.state.values?.contactChannel).toBe("phone");
    }
  });
});
