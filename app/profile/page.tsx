import type { Metadata } from "next";
import { MemberShell } from "@/components/layout/MemberShell";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { requireUser } from "@/lib/auth/guards";
import { formatJoinedDate, readAccountMetadata } from "@/lib/auth/user";
import { NO_MEDICAL_RECORDS_NOTICE, ROUTES } from "@/lib/constants/site";
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = {
  title: "Profile",
  description: "The account details Ahana holds for you.",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const user = await requireUser(ROUTES.profile);
  const account = readAccountMetadata(user);
  const joined = formatJoinedDate(account.createdAt);

  return (
    <MemberShell
      title="Profile"
      description="These are the account details we hold for you. You can update your profile or password below."
    >
      <div className="ahana-stack">
        <ProfileForm
          initialFullName={account.fullName ?? ""}
          initialEmail={account.email ?? ""}
          initialEmailConfirmed={account.emailConfirmed}
          initialPreferredLanguage={account.preferredLanguage}
          initialAccountType={account.accountType}
          initialJoinedDate={joined}
        />

        <AlertMessage variant="info" title="What this profile does not hold">
          <p>{NO_MEDICAL_RECORDS_NOTICE}</p>
        </AlertMessage>

        <section className="ahana-card" aria-labelledby="changes-heading">
          <h2 id="changes-heading">Security credentials</h2>
          <p>
            You can request a password reset at any time to update your login credentials.
          </p>
          <p>
            <SecondaryLink href={ROUTES.forgotPassword}>
              Reset your password
            </SecondaryLink>
          </p>
        </section>
      </div>
    </MemberShell>
  );
}
