import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthShell } from "@/components/auth/AuthShell";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { ROUTES } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Check your email",
  description: "Confirm your email address to finish setting up your account.",
};

type CheckEmailPageProps = {
  searchParams: Promise<{
    email?: string;
    mode?: string;
  }>;
};

export default async function CheckEmailPage({
  searchParams,
}: CheckEmailPageProps) {
  const params = await searchParams;
  const isReset = params.mode === "reset";

  // Displayed only as a reminder of where the email went. React escapes it,
  // and it is never used to look anything up.
  const email = params.email?.trim();

  return (
    <AuthShell>
      <AuthCard
        title="Check your email"
        description={
          <p>
            {isReset
              ? "If that address has an Ahana account, we have sent a link to reset your password."
              : "We have sent you a link to confirm your email address."}
          </p>
        }
        footer={
          <p>
            <SecondaryLink href={ROUTES.login}>
              Return to the login page
            </SecondaryLink>
          </p>
        }
      >
        {email ? (
          <AlertMessage variant="info" title="Sent to">
            <p>{email}</p>
          </AlertMessage>
        ) : null}

        <div className="ahana-stack">
          <p>
            Open the email and select the link to
            {isReset
              ? " choose a new password."
              : " activate your account. The link signs you in and takes you to your dashboard."}
          </p>
          <p className="ahana-muted">
            The link expires after a short time. If it does not arrive within a
            few minutes, check your spam or promotions folder.
          </p>
          <p>
            {isReset ? (
              <SecondaryLink href={ROUTES.forgotPassword}>
                Request another reset link
              </SecondaryLink>
            ) : (
              <SecondaryLink href={ROUTES.register}>
                Register with a different address
              </SecondaryLink>
            )}
          </p>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
