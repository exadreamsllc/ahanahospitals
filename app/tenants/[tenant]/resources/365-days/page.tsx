import type { Metadata } from "next";
import { MemberShell } from "@/components/layout/MemberShell";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { getCurrentUser } from "@/lib/auth/guards";
import { STORY_365 } from "@/lib/content/resources";
import { ROUTES } from "@/lib/constants/site";
import styles from "./story.module.css";

export const metadata: Metadata = {
  title: "365 Days of Meaningful Living - Ahana Hospitals",
  description: "A shared-meal initiative bringing people together with dignity, belonging and purpose.",
};

export default async function Story365Page() {
  const user = await getCurrentUser();
  const pdfUrl = "/assets/brochures/dr-c-ramasubramanian-profile.pdf";
  const whatsappUrl = "https://wa.me/919600314219";

  return (
    <MemberShell
      title={STORY_365.title}
      description={STORY_365.summary}
      isAuthenticated={Boolean(user)}
    >
      <div className={styles.stack}>
        <p className={styles.tamilTitle} lang="ta">
          {STORY_365.titleTamil}
        </p>

        {/* Video Player Embed */}
        <div className={styles.videoWrapper}>
          <iframe
            src="https://www.youtube.com/embed/WMjIftab4_U"
            title="365 Days of Meaningful Living Campaign Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Detailed Narrative */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle} style={{ color: "var(--ahana-purple-dark)" }}>
            &ldquo;சாதம் பிரசாதமாக மாறுவது கோவிலில் அல்ல...&rdquo;
          </h2>
          <p className={styles.sectionBody} style={{ marginBottom: "var(--ahana-space-4)", fontStyle: "italic" }}>
            &ldquo;Food turns into a holy offering (Prasadam) not inside a temple... but only when those who have give to those who do not..!&rdquo;
          </p>
          <p className={styles.sectionBody}>
            The original Tamil brochure presents a simple and humane idea: people should not feel remembered only on birthdays, festivals, or special days. A truly meaningful life is built through everyday inclusion, shared meals, participation, and community.
          </p>
          <p className={styles.sectionBody} style={{ marginTop: "var(--ahana-space-3)" }}>
            By sponsoring a meal, you directly support psychiatric patients and intellectually disabled children residing at our rehabilitation center in Madurai, helping satisfy deep hunger and providing them with warmth, health, and dignity.
          </p>
        </section>

        {/* Donation Tiers Card */}
        <section className={styles.donationCard}>
          <h3 className={styles.sectionTitle} style={{ margin: "0 0 var(--ahana-space-4)", fontSize: "var(--ahana-font-size-xl)" }}>
            Sponsor a Meal
          </h3>
          <p style={{ fontSize: "var(--ahana-font-size-sm)", color: "var(--ahana-muted)", marginBottom: "var(--ahana-space-4)" }}>
            Choose a tier to support our residents on your birthday, wedding anniversary, or in loving memory of a family member:
          </p>
          <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: "12px", fontSize: "var(--ahana-font-size-base)" }}>
            <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--ahana-border)", paddingBottom: "8px" }}>
              <span>🍳 <strong>Breakfast / Dinner</strong> (for 50 residents)</span>
              <strong style={{ color: "var(--ahana-purple-dark)" }}>₹2,500</strong>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--ahana-border)", paddingBottom: "8px" }}>
              <span>🍛 <strong>Full Lunch</strong> (for 50 residents)</span>
              <strong style={{ color: "var(--ahana-purple-dark)" }}>₹4,500</strong>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed var(--ahana-border)", paddingBottom: "8px" }}>
              <span>🍳 <strong>Breakfast / Dinner</strong> (for 250 residents)</span>
              <strong style={{ color: "var(--ahana-purple-dark)" }}>₹12,500</strong>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between", paddingBottom: "4px" }}>
              <span>🍛 <strong>Full Lunch</strong> (for 250 residents)</span>
              <strong style={{ color: "var(--ahana-purple-dark)" }}>₹22,500</strong>
            </li>
          </ul>

          <div style={{ marginTop: "var(--ahana-space-6)", textAlign: "center" }}>
            <SecondaryLink href={whatsappUrl} appearance="button" external>
              💬 Book a Sponsor Date via WhatsApp
            </SecondaryLink>
          </div>
        </section>

        <p style={{ marginTop: "var(--ahana-space-4)" }}>
          <SecondaryLink href={ROUTES.resources}>
            ← Back to the Knowledge Centre
          </SecondaryLink>
        </p>
      </div>
    </MemberShell>
  );
}
