import { describe, it, expect } from "vitest";
import {
  validateRegistration,
  validateLogin,
  validateEmailOnly,
  validateNewPassword,
  validatePassword,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_NAME_LENGTH,
} from "@/lib/validation/auth";

const GOOD_PASSWORD = "correct horse battery";

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

function validRegistration(overrides: Record<string, string> = {}) {
  return form({
    fullName: "Test Person",
    email: "test@example.com",
    password: GOOD_PASSWORD,
    confirmPassword: GOOD_PASSWORD,
    preferredLanguage: "English",
    accountType: "Member",
    acceptedTerms: "on",
    ...overrides,
  });
}

describe("validateRegistration", () => {
  it("accepts a complete valid submission", () => {
    const result = validateRegistration(validRegistration());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.fullName).toBe("Test Person");
      expect(result.data.email).toBe("test@example.com");
      expect(result.data.accountType).toBe("Member");
    }
  });

  it("normalises the email to lowercase", () => {
    const result = validateRegistration(
      validRegistration({ email: "  Test@EXAMPLE.com " })
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.email).toBe("test@example.com");
  });

  it("requires the terms checkbox", () => {
    const fd = validRegistration();
    fd.delete("acceptedTerms");
    const result = validateRegistration(fd);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.state.fieldErrors.acceptedTerms).toBeTruthy();
  });

  it("rejects mismatched passwords", () => {
    const result = validateRegistration(
      validRegistration({ confirmPassword: "something else entirely" })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.state.fieldErrors.confirmPassword).toBe(
        "Passwords do not match."
      );
    }
  });

  it("rejects a short password", () => {
    const short = "a".repeat(MIN_PASSWORD_LENGTH - 1);
    const result = validateRegistration(
      validRegistration({ password: short, confirmPassword: short })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.state.fieldErrors.password).toBeTruthy();
  });

  it("rejects a password beyond the bcrypt input ceiling", () => {
    const long = "a".repeat(MAX_PASSWORD_LENGTH + 1);
    const result = validateRegistration(
      validRegistration({ password: long, confirmPassword: long })
    );
    expect(result.ok).toBe(false);
  });

  it("requires a name", () => {
    const result = validateRegistration(validRegistration({ fullName: "   " }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.state.fieldErrors.fullName).toBeTruthy();
  });

  it("rejects an over-long name", () => {
    const result = validateRegistration(
      validRegistration({ fullName: "a".repeat(MAX_NAME_LENGTH + 1) })
    );
    expect(result.ok).toBe(false);
  });

  it("rejects a malformed email", () => {
    const result = validateRegistration(
      validRegistration({ email: "not-an-email" })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.state.fieldErrors.email).toBeTruthy();
  });

  it("coerces a privileged account type rather than failing", () => {
    // A crafted request must not error in a way that reveals intent — it is
    // silently coerced onto the allowlist.
    const result = validateRegistration(
      validRegistration({ accountType: "admin" })
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.accountType).toBe("Member");
  });

  it("NEVER echoes a password back in the error state", () => {
    const result = validateRegistration(
      validRegistration({ confirmPassword: "mismatch" })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const values = JSON.stringify(result.state.values ?? {});
      expect(values).not.toContain(GOOD_PASSWORD);
      expect(values).not.toContain("mismatch");
      expect(result.state.values).not.toHaveProperty("password");
      expect(result.state.values).not.toHaveProperty("confirmPassword");
    }
  });

  it("echoes back the safe fields so the form is not cleared", () => {
    const result = validateRegistration(
      validRegistration({ confirmPassword: "mismatch" })
    );
    if (!result.ok) {
      expect(result.state.values?.fullName).toBe("Test Person");
      expect(result.state.values?.email).toBe("test@example.com");
    }
  });

  it("reports every invalid field at once, not just the first", () => {
    const result = validateRegistration(
      form({ fullName: "", email: "bad", password: "x", confirmPassword: "y" })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const keys = Object.keys(result.state.fieldErrors);
      expect(keys).toContain("fullName");
      expect(keys).toContain("email");
      expect(keys).toContain("password");
      expect(keys).toContain("acceptedTerms");
    }
  });

  it("handles a completely empty submission without throwing", () => {
    expect(() => validateRegistration(new FormData())).not.toThrow();
    expect(validateRegistration(new FormData()).ok).toBe(false);
  });
});

describe("validateLogin", () => {
  it("accepts valid credentials", () => {
    const result = validateLogin(
      form({ email: "a@b.com", password: GOOD_PASSWORD })
    );
    expect(result.ok).toBe(true);
  });

  it("normalises the email", () => {
    const result = validateLogin(
      form({ email: "A@B.COM", password: GOOD_PASSWORD })
    );
    if (result.ok) expect(result.data.email).toBe("a@b.com");
  });

  it("requires a password", () => {
    const result = validateLogin(form({ email: "a@b.com" }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.state.fieldErrors.password).toBeTruthy();
  });

  it("does not enforce a minimum length on login", () => {
    // Length rules belong at registration. Enforcing them at login would leak
    // information about stored password policy.
    const result = validateLogin(form({ email: "a@b.com", password: "x" }));
    expect(result.ok).toBe(true);
  });

  it("never echoes the password back", () => {
    const result = validateLogin(form({ email: "bad", password: GOOD_PASSWORD }));
    if (!result.ok) {
      expect(JSON.stringify(result.state.values ?? {})).not.toContain(
        GOOD_PASSWORD
      );
    }
  });
});

describe("validateEmailOnly", () => {
  it("accepts and normalises", () => {
    const result = validateEmailOnly(form({ email: " User@Example.COM " }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.email).toBe("user@example.com");
  });

  it("rejects malformed and empty", () => {
    expect(validateEmailOnly(form({ email: "nope" })).ok).toBe(false);
    expect(validateEmailOnly(new FormData()).ok).toBe(false);
  });
});

describe("validateNewPassword", () => {
  it("accepts a matching valid pair", () => {
    const result = validateNewPassword(
      form({ password: GOOD_PASSWORD, confirmPassword: GOOD_PASSWORD })
    );
    expect(result.ok).toBe(true);
  });

  it("rejects a mismatch", () => {
    expect(
      validateNewPassword(form({ password: GOOD_PASSWORD, confirmPassword: "x" }))
        .ok
    ).toBe(false);
  });

  it("enforces the minimum length", () => {
    const short = "a".repeat(MIN_PASSWORD_LENGTH - 1);
    expect(
      validateNewPassword(form({ password: short, confirmPassword: short })).ok
    ).toBe(false);
  });
});

describe("validatePassword", () => {
  it("returns no errors for a valid matching pair", () => {
    expect(validatePassword(GOOD_PASSWORD, GOOD_PASSWORD)).toEqual({});
  });

  it("reports length before mismatch, so the user fixes the real problem", () => {
    const errors = validatePassword("short", "different");
    expect(errors.password).toBeTruthy();
    expect(errors.confirmPassword).toBeUndefined();
  });

  it("accepts a password of exactly the minimum length", () => {
    const exact = "a".repeat(MIN_PASSWORD_LENGTH);
    expect(validatePassword(exact, exact)).toEqual({});
  });

  it("preserves leading and trailing spaces in a password", () => {
    // Passwords are read with readSecret, which must not trim.
    const spaced = "  a valid password  ";
    expect(validatePassword(spaced, spaced)).toEqual({});
  });
});
