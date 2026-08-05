import type { Metadata } from "next";
import Link from "next/link";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { SERVICES } from "@/lib/content/services";
import { ROUTES } from "@/lib/constants/site";
import styles from "../public-pages.module.css";

export const metadata: Metadata = {
  title: "Product Overview",
  description: "Services offered by Ahana Hospitals and its associate organisations.",
};

const ORGANISATIONS = [
  {
    name: "Ahana Hospitals",
    text: "Specialist psychiatric, psychological, rehabilitation and family-centred care across Madurai.",
  },
  {
    name: "M.S. Chellamuthu Trust & Research Foundation",
    text: "Community mental-health, rehabilitation, research, awareness and inclusion programmes.",
  },
  {
    name: "Family and community network",
    text: "Caregivers, volunteers and partners who help extend support beyond hospital walls.",
  },
];

export default function ProductOverviewPage() {
  return (
    <div className={styles.page}>
      <AppHeader />
      <main className={styles.main}>
        <div className="ahana-container">
          <header className={styles.intro}>
            <span className="ahana-eyebrow">Product overview</span>
            <h1 className="ahana-display">A connected family of mental-health services</h1>
            <p>
              Ahana brings hospital care, rehabilitation, community support,
              education and family participation into one compassionate ecosystem.
            </p>
          </header>

          <section className={styles.section} aria-labelledby="services-title">
            <h2 id="services-title">Services offered</h2>
            <p className={styles.sectionLead}>A basic view of how Ahana can help. Detailed clinical pathways will be added after review by the care team.</p>
            <ul className={styles.grid}>
              {SERVICES.map((service) => (
                <li className={styles.card} key={service.number}>
                  <span className={styles.tag}>Service {service.number}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section} aria-labelledby="network-title">
            <h2 id="network-title">Ahana and its associate network</h2>
            <ul className={styles.grid}>
              {ORGANISATIONS.map((organisation) => (
                <li className={styles.card} key={organisation.name}>
                  <h3>{organisation.name}</h3>
                  <p>{organisation.text}</p>
                </li>
              ))}
            </ul>
            <div className={styles.actions}>
              <Link className={styles.action} href={ROUTES.letsTalk}>Find the right service</Link>
            </div>
          </section>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
