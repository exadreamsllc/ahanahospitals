import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { requireRecoverySession } from "@/lib/auth/guards";
import { MIN_PASSWORD_LENGTH } from "@/lib/validation/auth";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Set a new password for your Ahana account.",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
  // Reached with an active recovery session created by /auth/confirm.
  // Without one, the visitor is sent back to request a fresh link.
  await requireRecoverySession();

  return (
    <AuthShell>
      <AuthCard
        title="Choose a new password"
        description={
          <p>
            Pick a password of at least {MIN_PASSWORD_LENGTH} characters that
            you do not use anywhere else.
          </p>
        }
      >
        <ResetPasswordForm />
      </AuthCard>
    </AuthShell>
  );
}
