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
    "dotheneeds.com",
    "youmecare.health",
    "youmecareall.com",
    "xproevolve.com",
    "localhost:3000",
    "dotheneeds.localhost",
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
    hostname.includes("ahanahospitals") ||
    hostname.includes("ahana-hospitals")
  ) {
    subdomain = "ahana";
  }

  // 1. Run Supabase session validation (refreshes tokens and handles cookie transfers)
  let response = NextResponse.next({ request });
  try {
    response = await updateSession(request);
  } catch (err) {
    console.error("Supabase session update skipped/failed:", err);
  }

  // 2. Dynamic path-based routing for /LSHC/[tenant]/... or /[tenant.com]/...
  const segments = pathname.split("/");
  const firstSegment = segments[1] || "";
  
  if (pathname.startsWith("/LSHC/") || firstSegment.endsWith(".com")) {
    let tenantSegment = "";
    let remainingPathIndex = 3;
    
    if (pathname.startsWith("/LSHC/")) {
      tenantSegment = segments[2] || "";
      remainingPathIndex = 3;
    } else {
      tenantSegment = segments[1] || "";
      remainingPathIndex = 2;
    }
    
    let tenantSlug = tenantSegment.toLowerCase().replace(".com", "");
    // Map custom client slugs like 'ahanahospitals' to the DB tenant record 'ahana'
    if (tenantSlug === "ahanahospitals" || tenantSlug === "ahanahospital") {
      tenantSlug = "ahana";
    }
    
    if (tenantSlug) {
      const remainingPath = "/" + segments.slice(remainingPathIndex).join("/");
      
      // Exclude static assets from rewriting
      if (
        remainingPath.startsWith("/_next") ||
        remainingPath.startsWith("/api") ||
        remainingPath.includes(".")
      ) {
        return response;
      }
      
      const tenantUrl = request.nextUrl.clone();
      tenantUrl.pathname = `/tenants/${tenantSlug}${remainingPath === "/" ? "" : remainingPath}`;
      
      const rewriteResponse = NextResponse.rewrite(tenantUrl);
      response.cookies.getAll().forEach((cookie) => {
        rewriteResponse.cookies.set(cookie);
      });
      return rewriteResponse;
    }
  }

  // 3. Multitenant routing for subdomains
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

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
