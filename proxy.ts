import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/**
 * Next.js Multi-Tenant SaaS Routing & Auth Middleware.
 *
 * Rewrites requests dynamically based on the host header:
 * - youmecareall.com (and localhost:3000) -> Main SaaS parent landing page.
 * - [tenant].youmecareall.com (subdomain) -> Client hospital's portal (e.g. /tenants/[tenant]/...).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Approved domain mappings
  const mainDomains = [
    "youmecare.health",
    "youmecareall.com",
    "xproevolve.com",
    "localhost:3000",
    "youmecare.localhost",
    "youmecareall.localhost",
    "xproevolve.localhost"
  ];

  let subdomain = "";
  const matchedDomain = mainDomains.find((domain) => hostname.endsWith(domain));

  if (matchedDomain) {
    const part = hostname.replace(matchedDomain, "").replace(/\.$/, "");
    // Ignore www as a subdomain, treat it as the main parent domain
    if (part && part !== "www") {
      subdomain = part;
    }
  } else if (
    hostname.includes("ahanahospitals.vercel.app") ||
    hostname.includes("ahana-hospitals.vercel.app")
  ) {
    subdomain = "ahana";
  }

  // 1. Run Supabase session validation (refreshes tokens and handles cookie transfers)
  const response = await updateSession(request);

  // 2. Multitenant routing for subdomains
  if (subdomain) {
    // Exclude static assets, Next internals, icons, and auth confirmations
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.includes(".") ||
      pathname.startsWith("/auth/confirm") ||
      pathname.startsWith("/saas")
    ) {
      return response;
    }

    // Rewrite internally to /tenants/[subdomain]/[path]
    const tenantUrl = request.nextUrl.clone();
    tenantUrl.pathname = `/tenants/${subdomain}${pathname}`;

    const rewriteResponse = NextResponse.rewrite(tenantUrl);
    // Propagate refreshed Supabase tokens from session handler onto rewrite response
    response.cookies.getAll().forEach((cookie) => {
      rewriteResponse.cookies.set(cookie);
    });
    return rewriteResponse;
  }

  // 3. Main domain: rewrite root page "/" to "/saas" landing page
  if (pathname === "/") {
    const saasUrl = request.nextUrl.clone();
    saasUrl.pathname = "/saas";
    
    const rewriteResponse = NextResponse.rewrite(saasUrl);
    response.cookies.getAll().forEach((cookie) => {
      rewriteResponse.cookies.set(cookie);
    });
    return rewriteResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
