import type { Metadata } from "next";
import { MemberShell } from "@/components/layout/MemberShell";
import { getCurrentUser } from "@/lib/auth/guards";
import { NO_MEDICAL_RECORDS_NOTICE } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How Ahana Hospitals handles member account information.",
};

export default async function PrivacyPage() {
  const user = await getCurrentUser();

  return (
    <MemberShell
      title="Privacy Notice"
      description="A detailed summary of what your general member account stores and how we protect your privacy."
      isAuthenticated={Boolean(user)}
    >
      <div className="ahana-stack">
        <section className="ahana-notice" aria-live="polite">
          <p>
            <strong>Note:</strong> This notice is a draft for the general member account portal and is
            currently pending final review and approval by Ahana&apos;s legal and clinical teams before launch.
          </p>
        </section>

        <section className="ahana-card" aria-labelledby="purpose-heading">
          <h2 id="purpose-heading">What this account is for</h2>
          <p>
            The Ahana member account provides access to educational publications,
            saved resources, and account preferences. It is not a patient
            medical-record portal.
          </p>

          <h2>Information we store</h2>
          <p>
            When you register, we store your name, email address, preferred
            language, and the account type you selected (e.g., Member, Family/Caregiver,
            Volunteer, or Professional). Your password is stored only as a salted
            cryptographic hash by our secure authentication provider and is never
            visible to Ahana staff or systems.
          </p>

          <h2>Cookies &amp; session security</h2>
          <p>
            To keep your session secure, we use secure, HTTP-only cookies that prevent
            cross-site scripting (XSS) access. These cookies are used solely to
            maintain your logged-in state on this portal and are not used for external
            tracking or profiling.
          </p>

          <h2>What we do not store</h2>
          <p>{NO_MEDICAL_RECORDS_NOTICE}</p>

          <h2>Your choices</h2>
          <p>
            You may request that we update your preferred language or account metadata under
            your Profile. For inquiries regarding account deactivation or data retention, please
            contact the Ahana Hospitals helpdesk directly.
          </p>

          <h2>Contact</h2>
          <p>
            For questions regarding your account data, please contact the Ahana Hospitals helpdesk at{" "}
            <a href="mailto:helpdesk@ahanahospitals.in">
              helpdesk@ahanahospitals.in
            </a>
            .
          </p>
        </section>
      </div>
    </MemberShell>
  );
}
