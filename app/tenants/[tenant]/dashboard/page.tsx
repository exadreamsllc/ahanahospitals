import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MemberShell } from "@/components/layout/MemberShell";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { requireUser } from "@/lib/auth/guards";
import { readAccountMetadata } from "@/lib/auth/user";
import { NO_MEDICAL_RECORDS_NOTICE, ROUTES } from "@/lib/constants/site";
import { FOUNDER } from "@/lib/content/founder";
import { createClient } from "@/utils/supabase/server";
import { ReportView } from "@/components/admin/ReportView";
import styles from "./dashboard.module.css";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Ahana Hospitals member dashboard.",
  robots: { index: false, follow: false },
};

/** Cards for features arriving in a later release. */
const COMING_SOON = [
  {
    title: "Saved resources",
    description:
      "Keep any brochure, story or video and find it again in My Library.",
  },
  {
    title: "Reading progress",
    description: "Pick up longer stories exactly where you stopped reading.",
  },
  {
    title: "Tamil interface",
    description:
      "Read the portal itself in Tamil, not only the resources within it.",
  },
  {
    title: "Profile editing",
    description: "Update your name, language and preferences yourself.",
  },
] as const;

export default async function DashboardPage() {
  const user = await requireUser(ROUTES.dashboard);
  const account = readAccountMetadata(user);

  const greetingName = account.fullName ?? account.email ?? "there";

  const isElevated = ["Staff", "Administrator", "Professional", "Management"].includes(account.accountType);

  const supabase = await createClient();
  
  // Fetch profile preferences
  const { data: profile } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", user.id)
    .single();

  const preferences = profile?.preferences as any;
  const reportColumns = preferences?.report_columns || ["email", "phone", "status"];

  if (isElevated) {
    // Fetch callback requests
    const { data: callbacks } = await supabase
      .from("callback_requests")
      .select("*")
      .order("created_at", { ascending: false });

    return (
      <MemberShell
        title={`Operations Console — Welcome, ${greetingName}`}
        description="Configure your custom dashboard column preferences, view patient callback requests, and export physical report pages."
      >
        <ReportView
          callbacks={callbacks || []}
          initialColumns={reportColumns}
        />
      </MemberShell>
    );
  }

  // Render dummy EMR console for patients if mock record exists
  if (preferences?.patient_record) {
    const record = preferences.patient_record;
    return (
      <MemberShell
        title={`Welcome, ${greetingName}`}
        description="Your patient portal — review your active vitals, daily medication routine, upcoming diagnostics, and consult slots."
      >
        <div style={{ display: "grid", gap: "var(--ahana-space-6)" }}>
          {/* Header demographics */}
          <div className="ahana-panel" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--ahana-space-4)" }}>
            <div>
              <span style={{ fontSize: "var(--ahana-font-size-sm)", color: "var(--ahana-muted)" }}>Age / Sex</span>
              <p style={{ fontWeight: "bold", margin: 0 }}>{record.demographics?.age} Yrs / {record.demographics?.sex}</p>
            </div>
            <div>
              <span style={{ fontSize: "var(--ahana-font-size-sm)", color: "var(--ahana-muted)" }}>Height / Weight</span>
              <p style={{ fontWeight: "bold", margin: 0 }}>{record.demographics?.height} / {record.demographics?.weight}</p>
            </div>
            <div>
              <span style={{ fontSize: "var(--ahana-font-size-sm)", color: "var(--ahana-muted)" }}>Blood Group</span>
              <p style={{ fontWeight: "bold", margin: 0, color: "var(--ahana-orange)" }}>{record.demographics?.blood_group}</p>
            </div>
            <div>
              <span style={{ fontSize: "var(--ahana-font-size-sm)", color: "var(--ahana-muted)" }}>Living Unit</span>
              <p style={{ fontWeight: "bold", margin: 0 }}>{record.demographics?.living_environment}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--ahana-space-6)" }}>
            {/* Vitals */}
            <div className="ahana-panel">
              <h3 style={{ fontFamily: "var(--ahana-font-serif)", color: "var(--ahana-purple-dark)", borderBottom: "2px solid var(--ahana-orange)", paddingBottom: "4px", marginBottom: "12px" }}>
                Current Vitals
              </h3>
              <dl style={{ display: "grid", gap: "8px", margin: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "var(--ahana-muted)" }}>Blood Pressure</dt>
                  <dd style={{ fontWeight: "bold" }}>{record.vitals?.blood_pressure}</dd>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "var(--ahana-muted)" }}>Heart Rate</dt>
                  <dd style={{ fontWeight: "bold" }}>{record.vitals?.heart_rate}</dd>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "var(--ahana-muted)" }}>Oxygen Saturation (SpO2)</dt>
                  <dd style={{ fontWeight: "bold" }}>{record.vitals?.spo2}</dd>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <dt style={{ color: "var(--ahana-muted)" }}>Body Temperature</dt>
                  <dd style={{ fontWeight: "bold" }}>{record.vitals?.temperature}</dd>
                </div>
              </dl>
            </div>

            {/* Meds Plan */}
            <div className="ahana-panel">
              <h3 style={{ fontFamily: "var(--ahana-font-serif)", color: "var(--ahana-purple-dark)", borderBottom: "2px solid var(--ahana-orange)", paddingBottom: "4px", marginBottom: "12px" }}>
                Active Medication Plan
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "8px" }}>
                {record.meds_plan?.map((med: any, idx: number) => (
                  <li key={idx} style={{ background: "var(--ahana-surface-soft)", padding: "8px 12px", borderRadius: "var(--ahana-radius-md)", borderLeft: "4px solid var(--ahana-purple)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                      <span>{med.name}</span>
                      <span style={{ color: "var(--ahana-purple)" }}>{med.time}</span>
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--ahana-muted)" }}>{med.instructions}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Test Schedule */}
            <div className="ahana-panel">
              <h3 style={{ fontFamily: "var(--ahana-font-serif)", color: "var(--ahana-purple-dark)", borderBottom: "2px solid var(--ahana-orange)", paddingBottom: "4px", marginBottom: "12px" }}>
                Upcoming Diagnostics & Labs
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "8px" }}>
                {record.test_schedule?.map((test: any, idx: number) => (
                  <li key={idx} style={{ background: "var(--ahana-surface-soft)", padding: "8px 12px", borderRadius: "var(--ahana-radius-md)", borderLeft: "4px solid var(--ahana-orange)" }}>
                    <div style={{ fontWeight: "bold" }}>{test.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--ahana-muted)", marginTop: "4px" }}>
                      <span>📍 {test.location}</span>
                      <span>📅 {test.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Appointments */}
            <div className="ahana-panel">
              <h3 style={{ fontFamily: "var(--ahana-font-serif)", color: "var(--ahana-purple-dark)", borderBottom: "2px solid var(--ahana-orange)", paddingBottom: "4px", marginBottom: "12px" }}>
                Scheduled Appointments
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "8px" }}>
                {record.appointments?.map((app: any, idx: number) => (
                  <li key={idx} style={{ background: "var(--ahana-surface-soft)", padding: "8px 12px", borderRadius: "var(--ahana-radius-md)", borderLeft: "4px solid var(--ahana-purple-dark)" }}>
                    <div style={{ fontWeight: "bold" }}>{app.doctor}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--ahana-muted)", marginTop: "4px" }}>
                      <span>💬 {app.type}</span>
                      <span>📅 {app.date}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </MemberShell>
    );
  }

  return (
    <MemberShell
      title={`Welcome, ${greetingName}`}
      description="Your member area — the Ahana archive, the resources you save, and your account preferences."
    >
      <div className={styles.layout}>
        {/* Featured Video ---------------------------------------------- */}
        <section aria-labelledby="video-heading">
          <h2 id="video-heading" className={styles.sectionTitle}>
            Featured Video
          </h2>

          <div className={styles.videoWrapper}>
            <iframe
              src="https://www.youtube.com/embed/WMjIftab4_U"
              title="Ahana Hospitals - 365 Days of Meaningful Living"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <p className={styles.sectionNote}>
            Watch the video presentation of our &ldquo;365 Days of Meaningful Living&rdquo; community shared-meal program.
          </p>
        </section>

        {/* Quick links -------------------------------------------------- */}
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading" className={styles.sectionTitle}>
            Explore
          </h2>

          <ul className={`ahana-list-reset ${styles.cardGrid}`}>
            <li className={styles.card}>
              <span className={styles.badge}>My Library</span>
              <h3 className={styles.cardTitle}>Your saved resources</h3>
              <p className={styles.cardText}>
                Everything you keep will collect here, ready to open again
                later.
              </p>
              <SecondaryLink href={ROUTES.library} appearance="button">
                Open My Library
              </SecondaryLink>
            </li>

            <li className={`${styles.card} ${styles.founderCard}`}>
              <span className={styles.badge}>Founder Legacy</span>
              <h3 className={styles.cardTitle}>{FOUNDER.name}</h3>
              <p className={styles.cardText}>
                The belief that shaped Ahana — biography, timeline and archive.
              </p>
              <SecondaryLink href={ROUTES.founder} appearance="button">
                Read the story
              </SecondaryLink>
            </li>

            <li className={styles.card}>
              <span className={styles.badge}>Resources</span>
              <h3 className={styles.cardTitle}>Knowledge Centre</h3>
              <p className={styles.cardText}>
                Brochures, publications, research, videos and community
                programmes.
              </p>
              <SecondaryLink href={ROUTES.resources} appearance="button">
                Browse resources
              </SecondaryLink>
            </li>
          </ul>
        </section>

        {/* Account ------------------------------------------------------ */}
        <section className={styles.account} aria-labelledby="account-heading">
          <h2 id="account-heading" className={styles.sectionTitle}>
            Your account
          </h2>

          <dl className={`ahana-definition-list ${styles.accountList}`}>
            <div>
              <dt>Email address</dt>
              <dd>{account.email ?? "Not available"}</dd>
            </div>
            <div>
              <dt>Preferred language</dt>
              <dd>{account.preferredLanguage}</dd>
            </div>
            <div>
              <dt>Account type</dt>
              <dd>{account.accountType}</dd>
            </div>
          </dl>

          <div className={styles.accountActions}>
            <SecondaryLink href={ROUTES.profile}>View full profile</SecondaryLink>
            <form action={ROUTES.signOut} method="post">
              <PrimaryButton type="submit" variant="secondary">
                Sign out
              </PrimaryButton>
            </form>
          </div>
        </section>

        {/* Coming soon -------------------------------------------------- */}
        <section aria-labelledby="soon-heading">
          <h2 id="soon-heading" className={styles.sectionTitle}>
            Coming soon
          </h2>

          <ul className={`ahana-list-reset ${styles.soonGrid}`}>
            {COMING_SOON.map((item) => (
              <li key={item.title} className={styles.soonCard}>
                <h3 className={styles.soonTitle}>{item.title}</h3>
                <p className={styles.soonText}>{item.description}</p>
                <span className={styles.soonBadge}>In development</span>
              </li>
            ))}
          </ul>
        </section>

        <AlertMessage variant="info" title="No medical records here">
          <p>{NO_MEDICAL_RECORDS_NOTICE}</p>
        </AlertMessage>
      </div>
    </MemberShell>
  );
}
