import { describe, it, expect } from "vitest";
import {
  safeNextPath,
  resolveNextPath,
  loginRedirectFor,
} from "@/lib/auth/redirects";
import { ROUTES } from "@/lib/constants/site";

/**
 * Open-redirect protection.
 *
 * This is the control that stops `/auth/login?next=https://evil.example` from
 * bouncing a freshly authenticated member off-site. It has already contained
 * one real bug — a mangled character class that would have rejected every
 * hyphenated path — so the accept cases matter as much as the reject cases.
 */
describe("safeNextPath", () => {
  describe("accepts same-origin absolute paths", () => {
    const valid = [
      "/",
      "/dashboard",
      "/profile",
      "/library",
      "/resources/365-days", // hyphen — regressed once, must stay covered
      "/auth/reset-password",
      "/dashboard?tab=saved",
      "/resources?q=founder&page=2",
      "/product-overview",
      "/a/b/c/d/e",
      "/path#fragment",
      "/%E0%AE%A4%E0%AE%AE%E0%AE%BF%E0%AE%B4", // percent-encoded Tamil
    ];
    for (const path of valid) {
      it(`accepts ${JSON.stringify(path)}`, () => {
        expect(safeNextPath(path)).toBe(path);
      });
    }
  });

  describe("rejects anything that could leave the origin", () => {
    const invalid: Array<[string, string]> = [
      ["https://evil.example", "absolute https URL"],
      ["http://evil.example", "absolute http URL"],
      ["//evil.example", "protocol-relative"],
      ["///evil.example", "triple slash"],
      ["/\\evil.example", "backslash variant some browsers normalise to //"],
      ["javascript:alert(1)", "javascript scheme"],
      ["data:text/html,<script>", "data URI"],
      ["mailto:someone@example.com", "mailto scheme"],
      ["dashboard", "relative path without leading slash"],
      ["../etc/passwd", "traversal without leading slash"],
      ["", "empty string"],
      ["   ", "whitespace only"],
    ];
    for (const [path, why] of invalid) {
      it(`rejects ${JSON.stringify(path)} — ${why}`, () => {
        expect(safeNextPath(path)).toBeNull();
      });
    }
  });

  describe("rejects control characters", () => {
    // Browsers strip some of these, which can turn "/\tevil" into something
    // unexpected after normalisation.
    const controls = ["\u0000", "\u0009", "\u000a", "\u000d", "\u001f", "\u007f"];
    for (const c of controls) {
      it(`rejects a path containing U+${c.charCodeAt(0).toString(16).padStart(4, "0")}`, () => {
        expect(safeNextPath(`/dash${c}board`)).toBeNull();
      });
    }
  });

  it("returns null for null and undefined", () => {
    expect(safeNextPath(null)).toBeNull();
    expect(safeNextPath(undefined)).toBeNull();
  });

  it("trims surrounding whitespace before validating", () => {
    expect(safeNextPath("  /dashboard  ")).toBe("/dashboard");
  });

  it("does not treat a leading-slash lookalike as same-origin", () => {
    // "/\/evil.example" collapses to "//evil.example" in some parsers
    expect(safeNextPath("/\\/evil.example")).toBeNull();
  });
});

describe("resolveNextPath", () => {
  it("returns the path when valid", () => {
    expect(resolveNextPath("/profile")).toBe("/profile");
  });

  it("falls back to the dashboard for a hostile value", () => {
    expect(resolveNextPath("https://evil.example")).toBe(ROUTES.dashboard);
  });

  it("falls back to the dashboard for null", () => {
    expect(resolveNextPath(null)).toBe(ROUTES.dashboard);
  });

  it("honours an explicit fallback", () => {
    expect(resolveNextPath(null, ROUTES.home)).toBe(ROUTES.home);
    expect(resolveNextPath("//evil.example", ROUTES.login)).toBe(ROUTES.login);
  });
});

describe("loginRedirectFor", () => {
  it("encodes the intended destination", () => {
    expect(loginRedirectFor("/dashboard")).toBe(
      `${ROUTES.login}?next=%2Fdashboard`
    );
  });

  it("encodes a query string safely", () => {
    expect(loginRedirectFor("/dashboard?tab=saved")).toBe(
      `${ROUTES.login}?next=%2Fdashboard%3Ftab%3Dsaved`
    );
  });

  it("omits the parameter entirely for a hostile path", () => {
    expect(loginRedirectFor("https://evil.example")).toBe(ROUTES.login);
  });
});
