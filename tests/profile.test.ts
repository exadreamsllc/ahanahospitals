import { describe, it, expect, vi } from "vitest";
import { updateProfileAction } from "@/lib/actions/profile";
import { EMPTY_FORM_STATE } from "@/lib/validation/auth";

// Mock Supabase Server Client factory to prevent network requests during unit tests
vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        updateUser: vi.fn(() => Promise.resolve({ error: null })),
      },
    })
  ),
}));

// Mock next/cache revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("updateProfileAction validation", () => {
  it("rejects empty full name", async () => {
    const formData = new FormData();
    formData.append("fullName", "");
    formData.append("preferredLanguage", "Tamil");
    formData.append("accountType", "Volunteer");

    const result = await updateProfileAction(EMPTY_FORM_STATE, formData);
    expect(result.fieldErrors.fullName).toBe("Please enter your full name.");
    expect(result.message).toBe("Please correct the highlighted fields and try again.");
  });

  it("rejects names exceeding MAX_NAME_LENGTH (120 characters)", async () => {
    const longName = "A".repeat(121);
    const formData = new FormData();
    formData.append("fullName", longName);
    formData.append("preferredLanguage", "English");
    formData.append("accountType", "Member");

    const result = await updateProfileAction(EMPTY_FORM_STATE, formData);
    expect(result.fieldErrors.fullName).toBe("Name must be 120 characters or fewer.");
  });

  it("coerces invalid preferredLanguage and accountType to defaults and succeeds", async () => {
    const formData = new FormData();
    formData.append("fullName", "Ramesh Kumar");
    formData.append("preferredLanguage", "Klingon"); // Invalid language
    formData.append("accountType", "admin"); // Invalid account type (malicious attempt)

    const result = await updateProfileAction(EMPTY_FORM_STATE, formData);
    
    // Result message indicates success
    expect(result.message).toBe("Your profile has been updated successfully.");
    expect(result.fieldErrors).toEqual({});
    
    // Values should be coerced to defaults
    expect(result.values?.preferredLanguage).toBe("English"); // Default language
    expect(result.values?.accountType).toBe("Member"); // Default account type
  });

  it("submits well-formed profile updates successfully", async () => {
    const formData = new FormData();
    formData.append("fullName", "Meena Subramanian");
    formData.append("preferredLanguage", "Tamil");
    formData.append("accountType", "Volunteer");

    const result = await updateProfileAction(EMPTY_FORM_STATE, formData);

    expect(result.message).toBe("Your profile has been updated successfully.");
    expect(result.fieldErrors).toEqual({});
    expect(result.values?.fullName).toBe("Meena Subramanian");
    expect(result.values?.preferredLanguage).toBe("Tamil");
    expect(result.values?.accountType).toBe("Volunteer");
  });
});
