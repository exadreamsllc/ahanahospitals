import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  GUEST_ONLY_ROUTES,
  PROTECTED_ROUTE_PREFIXES,
  ROUTES,
} from "@/lib/constants/site";

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

/**
 * Carries any refreshed auth cookies onto a redirect response.
 *
 * Without this the Set-Cookie headers produced by the session refresh are
 * dropped, and the user is signed out on the next request.
 */
function withCookies(
  source: NextResponse,
  destination: NextResponse
): NextResponse {
  source.cookies.getAll().forEach((cookie) => {
    destination.cookies.set(cookie);
  });
  return destination;
}

/**
 * Refreshes the Supabase session on every request and enforces coarse route
 * access. Page-level guards repeat the check — this is the outer layer, not
 * the only one.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // getUser() validates the token with the Auth server. Do not swap this for
  // getSession(), which only decodes the local cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  const isProtected = PROTECTED_ROUTE_PREFIXES.some((route) =>
    matchesRoute(pathname, route)
  );

  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = ROUTES.login;
    loginUrl.search = "";
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return withCookies(response, NextResponse.redirect(loginUrl));
  }

  const isGuestOnly = GUEST_ONLY_ROUTES.some((route) =>
    matchesRoute(pathname, route)
  );

  if (user && isGuestOnly) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = ROUTES.dashboard;
    dashboardUrl.search = "";
    return withCookies(response, NextResponse.redirect(dashboardUrl));
  }

  return response;
}
