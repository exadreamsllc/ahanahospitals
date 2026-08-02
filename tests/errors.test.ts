import { describe, it, expect } from "vitest";
import type { AuthError } from "@supabase/supabase-js";
import {
  toSafeAuthMessage,
  isInvalidCredentials,
  GENERIC_AUTH_ERROR,
} from "@/lib/auth/errors";

/** Minimal AuthError stand-in — only the fields the mapper reads. */
function authError(partial: Partial<AuthError>): AuthError {
  return {
    name: "AuthApiError",
    message: "raw provider detail that must never reach a user",
    status: 400,
    ...partial,
  } as AuthError;
}

describe("toSafeAuthMessage — provider internals must never leak", () => {
  it("never returns the raw provider message", () => {
    const secret = "PostgreSQL connection string leaked in here";
    const message = toSafeAuthMessage(
      authError({ message: secret, code: "unrecognised_code_xyz" })
    );
    expect(message).not.toContain(secret);
    expect(message).toBe(GENERIC_AUTH_ERROR);
  });

  it("maps known codes to approved copy", () => {
    const cases: Array<[string, RegExp]> = [
      ["invalid_credentials", /email address or password is incorrect/i],
      ["email_not_confirmed", /confirm your email address/i],
      ["weak_password", /stronger password/i],
      ["same_password", /different from your current password/i],
      ["over_request_rate_limit", /too many attempts/i],
      ["over_email_send_rate_limit", /too many emails/i],
      ["otp_expired", /link has expired/i],
      ["signup_disabled", /temporarily unavailable/i],
      ["session_expired", /session has expired/i],
    ];
    for (const [code, pattern] of cases) {
      expect(toSafeAuthMessage(authError({ code }))).toMatch(pattern);
    }
  });

  it("maps HTTP 429 to the rate-limit message even without a code", () => {
    expect(toSafeAuthMessage(authError({ status: 429 }))).toMatch(
      /too many attempts/i
    );
  });

  it("returns the fallback for a null error", () => {
    expect(toSafeAuthMessage(null)).toBe(GENERIC_AUTH_ERROR);
  });

  it("honours a caller-supplied fallback", () => {
    const custom = "We could not create your account right now.";
    expect(toSafeAuthMessage(null, custom)).toBe(custom);
    expect(toSafeAuthMessage(authError({ code: "unknown" }), custom)).toBe(
      custom
    );
  });

  it("never returns an empty string", () => {
    const inputs = [
      null,
      authError({}),
      authError({ code: "" }),
      authError({ code: "nonsense" }),
      authError({ status: 500 }),
    ];
    for (const input of inputs) {
      expect(toSafeAuthMessage(input).length).toBeGreaterThan(0);
    }
  });

  it("does not distinguish a missing account from a wrong password", () => {
    // Both surface as invalid_credentials — enumeration resistance depends on
    // these being indistinguishable.
    const wrongPassword = toSafeAuthMessage(
      authError({ code: "invalid_credentials" })
    );
    const noSuchUser = toSafeAuthMessage(
      authError({ code: "invalid_credentials" })
    );
    expect(wrongPassword).toBe(noSuchUser);
  });

  it("never mentions internal terminology", () => {
    const forbidden = ["supabase", "postgres", "gotrue", "jwt", "sql", "token"];
    const messages = [
      toSafeAuthMessage(null),
      ...[
        "invalid_credentials",
        "email_not_confirmed",
        "weak_password",
        "over_request_rate_limit",
        "otp_expired",
      ].map((code) => toSafeAuthMessage(authError({ code }))),
    ];
    for (const message of messages) {
      for (const term of forbidden) {
        expect(message.toLowerCase()).not.toContain(term);
      }
    }
  });
});

describe("isInvalidCredentials", () => {
  it("is true for the explicit code", () => {
    expect(isInvalidCredentials(authError({ code: "invalid_credentials" }))).toBe(
      true
    );
  });

  it("is true for a bare 400", () => {
    expect(isInvalidCredentials(authError({ status: 400 }))).toBe(true);
  });

  it("is false for null and for a server error", () => {
    expect(isInvalidCredentials(null)).toBe(false);
    expect(isInvalidCredentials(authError({ status: 500, code: "x" }))).toBe(
      false
    );
  });
});
