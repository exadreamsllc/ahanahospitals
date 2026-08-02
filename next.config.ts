import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Supabase origins allowed for auth and API calls.
 *
 * Derived from the configured project URL so the policy is as narrow as
 * possible. Falls back to the wildcard used by the legacy static site if the
 * variable is absent at build time.
 */
function supabaseOrigins(): [string, string] {
  const configured = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (configured) {
    try {
      const { origin, host } = new URL(configured);
      return [origin, `wss://${host}`];
    } catch {
      // Malformed value — fall through to the wildcard.
    }
  }

  return ["https://*.supabase.co", "wss://*.supabase.co"];
}

/**
 * Content Security Policy.
 *
 * Mirrors the legacy static site's policy (see `_headers` at the repository
 * root) with the additions the Next.js App Router requires.
 *
 * KNOWN WEAKNESS: `script-src` includes `'unsafe-inline'`. The App Router
 * bootstraps hydration with inline scripts (`self.__next_f.push(...)`), which
 * cannot be allowed by origin alone. Removing it requires a per-request nonce
 * generated in `proxy.ts` — see docs/SECURITY.md for the upgrade path. Until
 * then this policy is meaningful defence against injected external scripts,
 * clickjacking and form hijacking, but not against reflected inline XSS.
 */
function contentSecurityPolicy(): string {
  const [supabaseHttp, supabaseWs] = supabaseOrigins();

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // 'unsafe-eval' is required by React Refresh in development only.
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
    // React and Next.js emit inline style tags and style attributes.
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    // next/font self-hosts its files at build time, so no external font host.
    "font-src": ["'self'", "data:"],
    "connect-src": [
      "'self'",
      supabaseHttp,
      supabaseWs,
      // Dev server websocket for hot module replacement.
      ...(isDev ? ["ws:", "http://localhost:*"] : []),
    ],
    "media-src": ["'self'"],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'none'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "frame-src": ["'none'"],
  };

  const policy = Object.entries(directives)
    .map(([directive, values]) => `${directive} ${values.join(" ")}`)
    .join("; ");

  // Only meaningful over HTTPS; omitted in development so localhost works.
  return isDev ? policy : `${policy}; upgrade-insecure-requests`;
}

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy(),
  },
  {
    // Blocks MIME sniffing, which can turn an uploaded file into a script.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Legacy clickjacking defence; frame-ancestors above covers modern browsers.
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Full URL same-origin, origin only cross-origin, nothing on downgrade —
    // keeps confirmation and reset tokens out of third-party referrer logs.
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // This release needs none of these capabilities.
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), interest-cohort=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "off",
  },
  {
    // Isolates the browsing context group from cross-origin openers.
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
];

/**
 * HSTS is added in production only — it is ignored over plain HTTP and would
 * be misleading in development.
 *
 * `includeSubDomains` is deliberately NOT set. It would force every subdomain
 * of the deployed host to HTTPS for the full max-age, which cannot be undone
 * quickly and would break any subdomain still served over HTTP. Add it (and
 * only then `preload`) once the subdomain inventory has been confirmed.
 */
const productionOnlyHeaders = isDev
  ? []
  : [
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000",
      },
    ];

const nextConfig: NextConfig = {
  // Do not advertise the framework version.
  poweredByHeader: false,

  async headers() {
    return [
      {
        // Every route, including route handlers and static assets.
        source: "/:path*",
        headers: [...securityHeaders, ...productionOnlyHeaders],
      },
    ];
  },
};

export default nextConfig;
