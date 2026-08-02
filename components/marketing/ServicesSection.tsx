import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { SERVICES } from "@/lib/content/services";
import { ROUTES } from "@/lib/constants/site";
import styles from "./ServicesSection.module.css";

/** The six Ahana services as a responsive card grid. */
export function ServicesSection() {
  return (
    <section className="ahana-section" id="services" aria-labelledby="services-heading">
      <div className="ahana-container">
        <SectionHeading
          eyebrow="How we help"
          title="Care designed around the person, not only the diagnosis"
          id="services-heading"
        />

        <ul className={`ahana-list-reset ${styles.grid}`}>
          {SERVICES.map((service) => (
            <li key={service.number} className={styles.card}>
              <span aria-hidden="true" className={styles.number}>
                {service.number}
              </span>
              <h3 className={styles.title}>{service.title}</h3>
              <p className={styles.description}>{service.description}</p>
              <Link href={ROUTES.letsTalk} className={styles.action}>
                {service.action}
                <span aria-hidden="true"> →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
