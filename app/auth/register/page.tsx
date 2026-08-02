import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { redirectIfAuthenticated } from "@/lib/auth/guards";
import { ROUTES } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Create a secure Ahana account to save resources and manage your preferences.",
};

export default async function RegisterPage() {
  // Middleware already redirects signed-in visitors; this repeats the check
  // at the page level so the guard does not depend on matcher configuration.
  await redirectIfAuthenticated();

  return (
    <AuthShell>
      <AuthCard
        title="Create your account"
        description={
          <p>
            Create a secure account to save brochures, access member resources,
            and manage your preferences. This account does not hold any medical
            records.
          </p>
        }
        footer={
          <p>
            Already have an account?{" "}
            <SecondaryLink href={ROUTES.login}>Log in</SecondaryLink>
          </p>
        }
      >
        <RegisterForm />
      </AuthCard>
    </AuthShell>
  );
}
