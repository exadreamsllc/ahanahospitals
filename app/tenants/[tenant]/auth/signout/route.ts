import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ROUTES } from "@/lib/constants/site";

/**
 * Signs the member out.
 *
 * POST only. A GET sign-out could be triggered by a prefetch, a cross-site
 * image tag, or a link in an email, so the browser must submit a form.
 * The redirect uses 303 so the browser follows it with a GET.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const response = NextResponse.redirect(
    new URL(`${ROUTES.login}?status=signed-out`, request.url),
    { status: 303 }
  );

  return response;
}

/** Sign-out must not happen on a GET; send the visitor to the login page. */
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL(ROUTES.login, request.url));
}
