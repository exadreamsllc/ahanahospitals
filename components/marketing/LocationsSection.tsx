import { SectionHeading } from "./SectionHeading";
import { LOCATIONS } from "@/lib/content/locations";
import { CONTACT } from "@/lib/content/contact";
import styles from "./LocationsSection.module.css";

/** Where to find Ahana, plus a helpdesk card for finding the nearest branch. */
export function LocationsSection() {
  return (
    <section
      className={`ahana-section ${styles.section}`}
      id="locations"
      aria-labelledby="locations-heading"
    >
      <div className="ahana-container">
        <SectionHeading
          eyebrow="Locations"
          title="Care across Madurai"
          id="locations-heading"
        />

        <ul className={`ahana-list-reset ${styles.grid}`}>
          {LOCATIONS.map((location) => (
            <li key={location.name} className={styles.card}>
              <h3 className={styles.name}>{location.name}</h3>
              <p className={styles.address}>{location.address}</p>
              {location.mapUrl ? (
                <a
                  className={styles.action}
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open map
                  <span aria-hidden="true"> →</span>
                </a>
              ) : null}
            </li>
          ))}

          <li className={`${styles.card} ${styles.helpdesk}`}>
            <h3 className={styles.name}>Need the nearest branch?</h3>
            <p className={styles.address}>
              Call our helpdesk and we will guide you to the most appropriate
              Ahana location and service.
            </p>
            <a className={styles.action} href={CONTACT.phoneHref}>
              Call helpdesk — {CONTACT.phoneDisplay}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
