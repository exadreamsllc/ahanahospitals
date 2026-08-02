import type { Metadata } from "next";
import { MemberShell } from "@/components/layout/MemberShell";
import { getCurrentUser } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms covering the use of Ahana Hospitals member accounts.",
};

export default async function TermsPage() {
  const user = await getCurrentUser();

  return (
    <MemberShell
      title="Terms of Use"
      description="The terms that cover your Ahana member account and the use of this portal."
      isAuthenticated={Boolean(user)}
    >
      <div className="ahana-stack">
        <section className="ahana-notice" aria-live="polite">
          <p>
            <strong>Note:</strong> These terms are a draft for the general member account portal and are
            currently pending final review and approval by Ahana&apos;s legal team before launch.
          </p>
        </section>

        <section className="ahana-card" aria-labelledby="education-heading">
          <h2 id="education-heading">Educational purpose</h2>
          <p>
            Website content supports general education and does not replace
            assessment, diagnosis, or treatment by a qualified healthcare professional.
          </p>

          <h2>Emergency use</h2>
          <p>
            Do not use this portal for emergencies. If you or someone else is at
            immediate risk, contact local emergency services or go to the nearest
            hospital.
          </p>

          <h2>Account responsibility</h2>
          <p>
            Keep your password confidential and secure. You are responsible for all
            activities that occur under your account. Please notify us immediately if you
            suspect unauthorized use of your credentials.
          </p>

          <h2>Acceptable use</h2>
          <p>
            Do not misuse, scrape, disrupt, or attempt unauthorized access to this
            website, the member portal, or other user accounts.
          </p>
        </section>
      </div>
    </MemberShell>
  );
}
