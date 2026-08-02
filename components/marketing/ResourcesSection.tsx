import { SectionHeading } from "./SectionHeading";
import { ResourceCard } from "./ResourceCard";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { RESOURCES } from "@/lib/content/resources";
import { ROUTES } from "@/lib/constants/site";
import styles from "./ResourcesSection.module.css";

/** Homepage preview of the Knowledge Centre — the three lead resources. */
export function ResourcesSection() {
  const featured = RESOURCES.slice(0, 3);

  return (
    <section
      className={`ahana-section ${styles.section}`}
      id="resources"
      aria-labelledby="resources-heading"
    >
      <div className="ahana-container">
        <SectionHeading
          eyebrow="Read · Watch · Learn · Preserve"
          title="Ahana Knowledge Centre"
          id="resources-heading"
          description={
            <p>
              A growing archive of institutional history, mental-health
              education, community programmes and publications.
            </p>
          }
        />

        <ul className={`ahana-list-reset ${styles.grid}`}>
          {featured.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </ul>

        <p className={styles.more}>
          <SecondaryLink href={ROUTES.resources} appearance="button">
            Browse the Knowledge Centre
          </SecondaryLink>
        </p>
      </div>
    </section>
  );
}
