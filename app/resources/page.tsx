import type { Metadata } from "next";
import { MemberShell } from "@/components/layout/MemberShell";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { getCurrentUser } from "@/lib/auth/guards";
import { ROUTES } from "@/lib/constants/site";
import { getSavedResourceIds } from "@/lib/auth/library";
import { toggleSaveResourceAction } from "@/lib/actions/library";
import { ResourcesCatalogue } from "./ResourcesCatalogue";
import styles from "./resources.module.css";

export const metadata: Metadata = {
  title: "Knowledge Centre",
  description:
    "Brochures, publications, research, founder history and videos from Ahana Hospitals.",
};

/**
 * Public Knowledge Centre. Reads the session only to pick the header and the
 * closing call to action — the catalogue itself is open to everyone.
 */
export default async function ResourcesPage() {
  const user = await getCurrentUser();
  const isAuthenticated = Boolean(user);

  const savedResourceIds = isAuthenticated ? await getSavedResourceIds() : [];

  const handleToggleSave = async (resourceId: string, currentSaved: boolean) => {
    "use server";
    await toggleSaveResourceAction(resourceId, currentSaved);
  };

  return (
    <MemberShell
      title="Ahana Knowledge Centre"
      description="A growing archive of institutional history, mental-health education, community programmes and publications."
      isAuthenticated={isAuthenticated}
    >
      <div className={styles.stack}>
        <ResourcesCatalogue
          isAuthenticated={isAuthenticated}
          savedResourceIds={savedResourceIds}
          onToggleSave={handleToggleSave}
        />

        <section className={`ahana-panel ${styles.cta}`}>
          <h2 className={styles.ctaTitle}>Save what matters to you</h2>
          <p>
            {isAuthenticated
              ? "All saved resources are compiled in your personal library for easy access."
              : "Create a free account and you will be able to save resources to your own library."}
          </p>
          <SecondaryLink
            href={isAuthenticated ? ROUTES.library : ROUTES.register}
            appearance="button"
          >
            {isAuthenticated ? "Go to My Library" : "Create an account"}
          </SecondaryLink>
        </section>
      </div>
    </MemberShell>
  );
}
