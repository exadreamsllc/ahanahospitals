/**
 * Static, non-secret site configuration shared by server and client code.
 * Nothing in this file may contain credentials.
 */

export const SITE_NAME = "Ahana Hospitals";

export const SITE_TITLE = "Ahana Hospitals | Mental Health and Rehabilitation";

export const SITE_DESCRIPTION =
  "Compassionate mental health, neuropsychiatric care, rehabilitation, education and community support from Ahana Hospitals.";

export const SITE_THEME_COLOR = "#4C2E83";

export const ROUTES = {
  home: "/",
  register: "/auth/register",
  login: "/auth/login",
  checkEmail: "/auth/check-email",
  confirm: "/auth/confirm",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  authCodeError: "/auth/auth-code-error",
  signOut: "/auth/signout",
  dashboard: "/dashboard",
  profile: "/profile",
  resources: "/resources",
  library: "/library",
  privacy: "/privacy",
  terms: "/terms",
  founder: "/founder",
  letsTalk: "/lets-talk",
  story365: "/resources/365-days",
  productOverview: "/product-overview",
} as const;

/** Routes that require an authenticated Supabase user. */
export const PROTECTED_ROUTE_PREFIXES = [
  ROUTES.dashboard,
  ROUTES.profile,
  ROUTES.library,
] as const;

/** Routes an already-authenticated user should not see. */
export const GUEST_ONLY_ROUTES = [ROUTES.login, ROUTES.register] as const;

export type NavItem = {
  href: string;
  label: string;
};

export const PUBLIC_NAV: readonly NavItem[] = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.productOverview, label: "Product Overview" },
  { href: ROUTES.founder, label: "Our Founder" },
  { href: ROUTES.resources, label: "Resources" },
  { href: ROUTES.letsTalk, label: "Let's Talk" },
] as const;

export const MEMBER_NAV: readonly NavItem[] = [
  { href: ROUTES.dashboard, label: "Dashboard" },
  { href: ROUTES.library, label: "My Library" },
  { href: ROUTES.resources, label: "Resources" },
  { href: ROUTES.founder, label: "Our Founder" },
  { href: ROUTES.profile, label: "Profile" },
] as const;

export const PREFERRED_LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Tamil", label: "தமிழ் (Tamil)" },
] as const;

export type PreferredLanguage = (typeof PREFERRED_LANGUAGES)[number]["value"];

export const DEFAULT_PREFERRED_LANGUAGE: PreferredLanguage = "English";

/**
 * Account type is INFORMATIONAL ONLY in Batch 1. It grants no privileges.
 * Staff/admin values are deliberately absent — a user must never be able to
 * assign themselves an elevated role through registration metadata.
 */
export const ACCOUNT_TYPES = [
  { value: "Member", label: "Member" },
  { value: "Family or Caregiver", label: "Family or Caregiver" },
  { value: "Volunteer", label: "Volunteer" },
  { value: "Professional", label: "Professional" },
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number]["value"];

export const DEFAULT_ACCOUNT_TYPE: AccountType = "Member";

export const NO_MEDICAL_RECORDS_NOTICE =
  "This account does not contain medical records. Ahana does not store clinical notes, diagnoses, prescriptions or treatment history here. For anything clinical, please contact the hospital directly.";
