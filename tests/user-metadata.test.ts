import { describe, it, expect } from "vitest";
import type { User } from "@supabase/supabase-js";
import {
  readAccountMetadata,
  getDisplayName,
  formatJoinedDate,
} from "@/lib/auth/user";

/**
 * `user_metadata` is user-writable. Nothing read from it may be trusted, and
 * the readers must survive it being absent, malformed, or hostile.
 */
function user(metadata: unknown, overrides: Partial<User> = {}): User {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    aud: "authenticated",
    app_metadata: {},
    user_metadata: metadata as Record<string, unknown>,
    created_at: "2026-01-15T10:00:00.000Z",
    email: "member@example.com",
    ...overrides,
  } as User;
}

describe("readAccountMetadata", () => {
  it("reads well-formed metadata", () => {
    const account = readAccountMetadata(
      user({
        full_name: "Priya R",
        preferred_language: "Tamil",
        account_type: "Volunteer",
      })
    );
    expect(account.fullName).toBe("Priya R");
    expect(account.preferredLanguage).toBe("Tamil");
    expect(account.accountType).toBe("Volunteer");
    expect(account.email).toBe("member@example.com");
  });

  it("coerces a privileged account type on READ, not only on write", () => {
    // Defence in depth: even if a bad value reached the database, it must not
    // be rendered back as if legitimate.
    const account = readAccountMetadata(user({ account_type: "admin" }));
    expect(account.accountType).toBe("Member");
  });

  it("coerces an unknown language on read", () => {
    expect(
      readAccountMetadata(user({ preferred_language: "Klingon" }))
        .preferredLanguage
    ).toBe("English");
  });

  describe("survives hostile or absent metadata", () => {
    const hostile: Array<[string, unknown]> = [
      ["undefined", undefined],
      ["null", null],
      ["empty object", {}],
      ["array", []],
      ["string", "not an object"],
      ["number", 42],
      ["nested nulls", { full_name: null, account_type: null }],
      ["wrong types", { full_name: 123, preferred_language: [], account_type: {} }],
      ["whitespace name", { full_name: "   " }],
    ];
    for (const [label, metadata] of hostile) {
      it(`handles ${label} without throwing`, () => {
        expect(() => readAccountMetadata(user(metadata))).not.toThrow();
        const account = readAccountMetadata(user(metadata));
        expect(account.accountType).toBe("Member");
        expect(account.preferredLanguage).toBe("English");
      });
    }
  });

  it("returns null rather than an empty string for a missing name", () => {
    expect(readAccountMetadata(user({})).fullName).toBeNull();
    expect(readAccountMetadata(user({ full_name: "  " })).fullName).toBeNull();
  });

  it("trims a padded name", () => {
    expect(readAccountMetadata(user({ full_name: "  Anil  " })).fullName).toBe(
      "Anil"
    );
  });

  it("reports email confirmation state", () => {
    expect(readAccountMetadata(user({})).emailConfirmed).toBe(false);
    expect(
      readAccountMetadata(
        user({}, { email_confirmed_at: "2026-01-15T10:05:00.000Z" } as Partial<User>)
      ).emailConfirmed
    ).toBe(true);
  });

  it("exposes no clinical fields, whatever the metadata contains", () => {
    // ADR-004: even if something clinical were written to metadata, the reader
    // must not surface it.
    const account = readAccountMetadata(
      user({
        full_name: "Test",
        diagnosis: "should never be read",
        medication: "should never be read",
        notes: "should never be read",
      })
    );
    expect(Object.keys(account).sort()).toEqual([
      "accountType",
      "createdAt",
      "email",
      "emailConfirmed",
      "fullName",
      "preferredLanguage",
    ]);
    expect(JSON.stringify(account)).not.toContain("should never be read");
  });
});

describe("getDisplayName", () => {
  it("prefers the full name", () => {
    expect(getDisplayName(user({ full_name: "Meena S" }))).toBe("Meena S");
  });

  it("falls back to the local part of the email", () => {
    expect(getDisplayName(user({}))).toBe("member");
  });

  it("falls back to a neutral greeting with neither", () => {
    expect(getDisplayName(user({}, { email: undefined }))).toBe("there");
  });

  it("never returns an empty string", () => {
    for (const metadata of [undefined, null, {}, { full_name: "  " }]) {
      expect(getDisplayName(user(metadata)).length).toBeGreaterThan(0);
    }
  });
});

describe("formatJoinedDate", () => {
  it("formats an ISO date", () => {
    const formatted = formatJoinedDate("2026-01-15T10:00:00.000Z");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("January");
  });

  it("returns null for null, empty and malformed input", () => {
    expect(formatJoinedDate(null)).toBeNull();
    expect(formatJoinedDate("")).toBeNull();
    expect(formatJoinedDate("not a date")).toBeNull();
  });

  it("is timezone-stable — the same instant formats identically", () => {
    // Rendered server-side; must not drift across the date line.
    expect(formatJoinedDate("2026-01-15T00:00:00.000Z")).toBe(
      formatJoinedDate("2026-01-15T23:59:59.000Z")
    );
  });
});
