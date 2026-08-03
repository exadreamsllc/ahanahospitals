import type { Metadata } from "next";
import Link from "next/link";
import { MemberShell } from "@/components/layout/MemberShell";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { ROUTES } from "@/lib/constants/site";
import styles from "./founder-profile.module.css";

export const metadata: Metadata = {
  title: "Dr. C. Ramasubramanian - Profile Brochure",
  description: "A comprehensive profile of our founder, covering clinical achievements, community care, and awards.",
};

const CHAPTERS = [
  {
    title: "1. Academic Foundations",
    description: "MBBS, DPM, and MD in Psychiatry from Madurai Medical College. Early research in neuropsychiatry.",
  },
  {
    title: "2. Founding Ahana Hospitals",
    description: "Establishing Madurai's flagship psychiatric and rehabilitation hospital network.",
  },
  {
    title: "3. Psychosocial Rehabilitation",
    description: "Pioneering residential and day-care programmes to integrate patients back into society.",
  },
  {
    title: "4. Community Camp Campaigns",
    description: "Organizing rural mental health screening clinics and caregiver awareness assemblies.",
  },
  {
    title: "5. Awards & Lifetime Honors",
    description: "National and state-level recognition for outstanding contributions to community medicine.",
  },
];

export default function FounderProfilePage() {
  const pdfUrl = "/assets/brochures/dr-c-ramasubramanian-profile.pdf";

  return (
    <MemberShell
      title="Dr. C. Ramasubramanian — Profile"
      description="A structured index and reader for our founder's institutional profile."
    >
      <Link href={ROUTES.resources} className={styles.backButton}>
        ← Back to Knowledge Centre
      </Link>

      <div className={styles.layout}>
        {/* Left Column: Chapters & Details */}
        <div className={styles.leftColumn}>
          <section className={styles.profileCard}>
            <h2 className={styles.cardTitle}>Brochure Chapters</h2>
            <p style={{ fontSize: "var(--ahana-font-size-sm)", color: "var(--ahana-muted)", marginBottom: "var(--ahana-space-4)" }}>
              This 11-page profile brochure details the timeline, publications, and impact work of Dr. C. Ramasubramanian:
            </p>
            <ul className={styles.chaptersList}>
              {CHAPTERS.map((ch) => (
                <li key={ch.title} className={styles.chapterItem}>
                  <span className={styles.chapterTitle}>{ch.title}</span>
                  <p className={styles.chapterText}>{ch.description}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Mobile Fallback Card */}
          <div className={styles.mobileDownloadCard}>
            <p><strong>Reading on a mobile device?</strong> For the best reading experience, download or open the profile PDF directly:</p>
            <SecondaryLink href={pdfUrl} appearance="button">
              📥 Open Profile PDF (3.1 MB)
            </SecondaryLink>
          </div>
        </div>

        {/* Right Column: PDF Viewer Embed */}
        <div className={styles.rightColumn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "var(--ahana-font-size-sm)", fontWeight: 600, color: "var(--ahana-purple-dark)" }}>
              Original PDF Document Reader
            </span>
            <a href={pdfUrl} download style={{ fontSize: "var(--ahana-font-size-sm)", color: "var(--ahana-purple)", textDecoration: "none", fontWeight: "bold" }}>
              Download original file ➔
            </a>
          </div>
          <embed
            src={pdfUrl}
            type="application/pdf"
            className={styles.pdfFrame}
          />
        </div>
      </div>
    </MemberShell>
  );
}
