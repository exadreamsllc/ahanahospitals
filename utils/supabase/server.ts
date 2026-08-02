import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  let clientIp: string | null = null;

  try {
    const reqHeaders = await headers();
    clientIp = reqHeaders.get("x-forwarded-for");
  } catch {
    // Suppress error if called during build/static generation
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        headers: clientIp ? { "x-forwarded-for": clientIp } : {},
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components may not be allowed to write cookies.
            // Middleware handles session refresh.
          }
        },
      },
    }
  );
}
