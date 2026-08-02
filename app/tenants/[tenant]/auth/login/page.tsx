import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { redirectIfAuthenticated } from "@/lib/auth/guards";
import { safeNextPath } from "@/lib/auth/redirects";
import { ROUTES } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to your Ahana Hospitals member account.",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    status?: string;
  }>;
};

/** Status banners driven by redirects from other auth flows. */
const STATUS_MESSAGES: Record<string, string> = {
  "password-updated":
    "Your password has been updated. Please sign in with your new password.",
  "signed-out": "You have been signed out.",
  "session-expired": "Your session has expired. Please sign in again.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  await redirectIfAuthenticated();

  const params = await searchParams;
  const nextPath = safeNextPath(params.next ?? null) ?? undefined;
  const statusMessage = params.status
    ? STATUS_MESSAGES[params.status]
    : undefined;

  return (
    <AuthShell>
      <AuthCard
        title="Log in"
        description={<p>Welcome back. Sign in to reach your member area.</p>}
        footer={
          <p>
            New to Ahana?{" "}
            <SecondaryLink href={ROUTES.register}>
              Create an account
            </SecondaryLink>
          </p>
        }
      >
        {statusMessage ? (
          <AlertMessage variant="success">
            <p>{statusMessage}</p>
          </AlertMessage>
        ) : null}

        <LoginForm nextPath={nextPath} />
      </AuthCard>
    </AuthShell>
  );
}
