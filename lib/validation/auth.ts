/**
 * Server-side validation helpers for the authentication forms.
 *
 * Every value that reaches Supabase must pass through here. Client-side
 * attributes (required, minLength, type=email) are a convenience only — they
 * are never trusted.
 */

import {
  ACCOUNT_TYPES,
  DEFAULT_ACCOUNT_TYPE,
  DEFAULT_PREFERRED_LANGUAGE,
  PREFERRED_LANGUAGES,
  type AccountType,
  type PreferredLanguage,
} from "@/lib/constants/site";

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 72; // bcrypt input ceiling used by Supabase
export const MAX_NAME_LENGTH = 120;
export const MAX_EMAIL_LENGTH = 254;

export type FieldErrors = Record<string, string>;

export type FormState = {
  /** Form-level message shown in an AlertMessage. */
  message: string | null;
  /** Per-field messages keyed by input name. */
  fieldErrors: FieldErrors;
  /** Values safe to echo back into the form (never passwords). */
  values?: Record<string, string>;
};

export const EMPTY_FORM_STATE: FormState = {
  message: null,
  fieldErrors: {},
};

export function formError(
  message: string,
  fieldErrors: FieldErrors = {},
  values?: Record<string, string>
): FormState {
  return { message, fieldErrors, values };
}

/** Reads a form value as a trimmed string, tolerating File/null entries. */
export function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Reads a password without trimming — leading/trailing spaces are valid. */
export function readSecret(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function readCheckbox(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

/** Lowercases and trims an email address for consistent identity matching. */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Pragmatic email shape check. Supabase performs the authoritative validation;
 * this exists to give the user a fast, friendly message.
 */
export function isValidEmail(value: string): boolean {
  if (!value || value.length > MAX_EMAIL_LENGTH) return false;
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value);
}

export function validatePassword(
  password: string,
  confirmPassword: string,
  fieldPrefix: { password: string; confirm: string } = {
    password: "password",
    confirm: "confirmPassword",
  }
): FieldErrors {
  const errors: FieldErrors = {};

  if (!password) {
    errors[fieldPrefix.password] = "Please choose a password.";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors[fieldPrefix.password] =
      `Password must contain at least ${MIN_PASSWORD_LENGTH} characters.`;
  } else if (password.length > MAX_PASSWORD_LENGTH) {
    errors[fieldPrefix.password] =
      `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`;
  }

  if (!errors[fieldPrefix.password] && password !== confirmPassword) {
    errors[fieldPrefix.confirm] = "Passwords do not match.";
  }

  return errors;
}

function isAllowedLanguage(value: string): value is PreferredLanguage {
  return PREFERRED_LANGUAGES.some((option) => option.value === value);
}

function isAllowedAccountType(value: string): value is AccountType {
  return ACCOUNT_TYPES.some((option) => option.value === value);
}

/**
 * Coerces an untrusted language value onto the allowlist.
 * Unknown values silently fall back to the default rather than erroring.
 */
export function coercePreferredLanguage(value: string): PreferredLanguage {
  return isAllowedLanguage(value) ? value : DEFAULT_PREFERRED_LANGUAGE;
}

/**
 * Coerces an untrusted account type onto the allowlist. This is the control
 * that prevents a crafted request from writing "staff" or "admin" into user
 * metadata. Account type carries no authorisation in Batch 1 regardless.
 */
export function coerceAccountType(value: string): AccountType {
  return isAllowedAccountType(value) ? value : DEFAULT_ACCOUNT_TYPE;
}

export type RegistrationInput = {
  fullName: string;
  email: string;
  password: string;
  preferredLanguage: PreferredLanguage;
  accountType: AccountType;
};

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; state: FormState };

export function validateRegistration(
  formData: FormData
): ValidationResult<RegistrationInput> {
  const fullName = readString(formData, "fullName");
  const email = normalizeEmail(readString(formData, "email"));
  const password = readSecret(formData, "password");
  const confirmPassword = readSecret(formData, "confirmPassword");
  const preferredLanguage = coercePreferredLanguage(
    readString(formData, "preferredLanguage")
  );
  const accountType = coerceAccountType(readString(formData, "accountType"));
  const acceptedTerms = readCheckbox(formData, "acceptedTerms");

  const fieldErrors: FieldErrors = {};

  if (!fullName) {
    fieldErrors.fullName = "Please enter your full name.";
  } else if (fullName.length > MAX_NAME_LENGTH) {
    fieldErrors.fullName = `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }

  if (!email) {
    fieldErrors.email = "Please enter your email address.";
  } else if (!isValidEmail(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  Object.assign(fieldErrors, validatePassword(password, confirmPassword));

  if (!acceptedTerms) {
    fieldErrors.acceptedTerms =
      "Please accept the Privacy Notice and Terms of Use.";
  }

  // Values echoed back on error — passwords are deliberately excluded.
  const values = { fullName, email, preferredLanguage, accountType };

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      state: formError(
        "Please correct the highlighted fields and try again.",
        fieldErrors,
        values
      ),
    };
  }

  return {
    ok: true,
    data: { fullName, email, password, preferredLanguage, accountType },
  };
}

export type LoginInput = {
  email: string;
  password: string;
};

export function validateLogin(formData: FormData): ValidationResult<LoginInput> {
  const email = normalizeEmail(readString(formData, "email"));
  const password = readSecret(formData, "password");

  const fieldErrors: FieldErrors = {};

  if (!email) {
    fieldErrors.email = "Please enter your email address.";
  } else if (!isValidEmail(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (!password) {
    fieldErrors.password = "Please enter your password.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      state: formError(
        "Please correct the highlighted fields and try again.",
        fieldErrors,
        { email }
      ),
    };
  }

  return { ok: true, data: { email, password } };
}

export function validateEmailOnly(
  formData: FormData
): ValidationResult<{ email: string }> {
  const email = normalizeEmail(readString(formData, "email"));

  if (!email || !isValidEmail(email)) {
    return {
      ok: false,
      state: formError("Please enter a valid email address.", {
        email: "Please enter a valid email address.",
      }),
    };
  }

  return { ok: true, data: { email } };
}

export function validateNewPassword(
  formData: FormData
): ValidationResult<{ password: string }> {
  const password = readSecret(formData, "password");
  const confirmPassword = readSecret(formData, "confirmPassword");

  const fieldErrors = validatePassword(password, confirmPassword);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      state: formError(
        "Please correct the highlighted fields and try again.",
        fieldErrors
      ),
    };
  }

  return { ok: true, data: { password } };
}
