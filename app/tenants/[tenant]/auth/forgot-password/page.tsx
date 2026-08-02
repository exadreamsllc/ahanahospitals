import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { ROUTES } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Request a link to reset your Ahana account password.",
};

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await searchParams;
  const linkExpired = params.status === "link-expired";

  return (
    <AuthShell>
      <AuthCard
        title="Reset your password"
        description={
          <p>
            Enter your email address and we will send you a link to choose a new
            password.
          </p>
        }
        footer={
          <p>
            Remembered it?{" "}
            <SecondaryLink href={ROUTES.login}>Return to log in</SecondaryLink>
          </p>
        }
      >
        {linkExpired ? (
          <AlertMessage variant="error" title="Your reset link has expired">
            <p>Request a new link below and open it as soon as it arrives.</p>
          </AlertMessage>
        ) : null}

        <ForgotPasswordForm />
      </AuthCard>
    </AuthShell>
  );
}
