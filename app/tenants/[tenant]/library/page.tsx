import type { Metadata } from "next";
import { MemberShell } from "@/components/layout/MemberShell";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { ResourceCard } from "@/components/marketing/ResourceCard";
import { requireUser } from "@/lib/auth/guards";
import { getDisplayName } from "@/lib/auth/user";
import { ROUTES } from "@/lib/constants/site";
import { getSavedResourceIds } from "@/lib/auth/library";
import { toggleSaveResourceAction } from "@/lib/actions/library";
import { RESOURCES } from "@/lib/content/resources";
import styles from "../resources/resources.module.css";

export const metadata: Metadata = {
  title: "My Library",
  description: "Resources you have saved from Ahana Hospitals.",
  robots: { index: false, follow: false },
};

export default async function LibraryPage() {
  const user = await requireUser(ROUTES.library);
  const name = getDisplayName(user);

  const savedResourceIds = await getSavedResourceIds();
  const savedResources = RESOURCES.filter((r) => savedResourceIds.includes(r.id));

  const handleToggleSave = async (resourceId: string, currentSaved: boolean) => {
    "use server";
    await toggleSaveResourceAction(resourceId, currentSaved);
  };

  return (
    <MemberShell
      title="My Library"
      description={`This is where the resources you save will collect, ${name}.`}
    >
      <div className={styles.stack}>
        {savedResources.length > 0 ? (
          <section aria-labelledby="saved-heading">
            <h2 id="saved-heading" className="sr-only">
              Your Bookmarks
            </h2>
            <ul className={`ahana-list-reset ${styles.grid}`}>
              {savedResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  showSaveButton={true}
                  isSaved={true}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </ul>
          </section>
        ) : (
          <section className="ahana-card" aria-labelledby="empty-heading">
            <h2 id="empty-heading">Nothing saved yet</h2>
            <p>
              Any brochure, publication, research summary or video you save from the
              Resources area will appear here, ready to open again later.
            </p>
            <p style={{ marginTop: "var(--ahana-space-4)" }}>
              <SecondaryLink href={ROUTES.resources} appearance="button">
                Browse resources
              </SecondaryLink>
            </p>
          </section>
        )}

        <section className="ahana-notice" aria-labelledby="scope-heading">
          <h2 id="scope-heading">What your library will hold</h2>
          <p>
            Your library stores links to published Ahana material only. It does
            not hold clinical notes, appointment history or any medical record.
          </p>
        </section>
      </div>
    </MemberShell>
  );
}
