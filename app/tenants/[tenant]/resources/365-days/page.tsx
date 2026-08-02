import type { Metadata } from "next";
import Image from "next/image";
import { MemberShell } from "@/components/layout/MemberShell";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { getCurrentUser } from "@/lib/auth/guards";
import { STORY_365 } from "@/lib/content/resources";
import { ROUTES } from "@/lib/constants/site";
import styles from "./story.module.css";

export const metadata: Metadata = {
  title: "365 Days of Meaningful Living",
  description:
    "A shared-meal initiative bringing people together with dignity, belonging and purpose.",
};

export default async function Story365Page() {
  const user = await getCurrentUser();

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

        <div className={styles.hero}>
          <Image
            src={STORY_365.gallery[0].src}
            alt={STORY_365.gallery[0].alt}
            width={1351}
            height={1800}
            className={styles.heroImage}
            priority
          />
        </div>

        {STORY_365.sections.map((section) => (
          <section key={section.heading} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.heading}</h2>
            <p className={styles.sectionBody}>{section.body}</p>
          </section>
        ))}

        <section aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" className={styles.sectionTitle}>
            From the programme
          </h2>
          <ul className={`ahana-list-reset ${styles.gallery}`}>
            {STORY_365.gallery.slice(1).map((photo) => (
              <li key={photo.src} className={styles.galleryItem}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={1350}
                  height={1800}
                  className={styles.galleryImage}
                />
              </li>
            ))}
          </ul>
        </section>

        <p>
          <SecondaryLink href={ROUTES.resources}>
            ← Back to the Knowledge Centre
          </SecondaryLink>
        </p>
      </div>
    </MemberShell>
  );
}
