import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { logAuthFailure } from "@/lib/auth/errors";
import { resolveNextPath } from "@/lib/auth/redirects";
import { ROUTES } from "@/lib/constants/site";

/**
 * OTP types Supabase may send to this handler. Anything else is rejected
 * rather than passed through to `verifyOtp`.
 */
const ALLOWED_OTP_TYPES: readonly EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];

function isAllowedOtpType(value: string | null): value is EmailOtpType {
  return value !== null && ALLOWED_OTP_TYPES.includes(value as EmailOtpType);
}

/**
 * Verifies an email confirmation or recovery link.
 *
 * Supabase appends `token_hash` and `type` to the URL configured as
 * `emailRedirectTo`. On success the session cookies are written to the
 * redirect response directly, which is why this handler builds its own
 * Supabase client rather than reusing the cookies()-based server helper.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = resolveNextPath(searchParams.get("next"), ROUTES.dashboard);

  const errorUrl = new URL(ROUTES.authCodeError, request.url);

  if (!tokenHash || !isAllowedOtpType(type)) {
    return NextResponse.redirect(errorUrl);
  }

  const response = NextResponse.redirect(new URL(next, request.url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    logAuthFailure("verifyOtp", error);
    return NextResponse.redirect(errorUrl);
  }

  return response;
}
