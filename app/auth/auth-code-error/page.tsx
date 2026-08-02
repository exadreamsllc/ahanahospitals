import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthShell } from "@/components/auth/AuthShell";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { ROUTES } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Link not valid",
  description: "This confirmation link could not be verified.",
  robots: { index: false, follow: false },
};

export default function AuthCodeErrorPage() {
  return (
    <AuthShell>
      <AuthCard
        title="That link did not work"
        description={
          <p>We could not verify the link you followed.</p>
        }
        footer={
          <p>
            <SecondaryLink href={ROUTES.login}>
              Return to the login page
            </SecondaryLink>
          </p>
        }
      >
        <AlertMessage variant="error" title="The link is expired or invalid">
          <p>
            Confirmation and reset links can only be used once, and they expire
            after a short time.
          </p>
        </AlertMessage>

        <div className="ahana-stack">
          <p>You can try one of the following:</p>
          <ul>
            <li>
              Request a new password reset link from the{" "}
              <SecondaryLink href={ROUTES.forgotPassword}>
                forgot password
              </SecondaryLink>{" "}
              page.
            </li>
            <li>
              Register again from the{" "}
              <SecondaryLink href={ROUTES.register}>
                create account
              </SecondaryLink>{" "}
              page if you never confirmed your address.
            </li>
            <li>
              Make sure you opened the most recent email — older links stop
              working once a newer one is sent.
            </li>
          </ul>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
