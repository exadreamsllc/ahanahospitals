import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { Hero } from "@/components/marketing/Hero";
import { TrustBand } from "@/components/marketing/TrustBand";
import { ServicesSection } from "@/components/marketing/ServicesSection";
import { FounderSection } from "@/components/marketing/FounderSection";
import { LetsTalkSection } from "@/components/marketing/LetsTalkSection";
import { ResourcesSection } from "@/components/marketing/ResourcesSection";
import { TeamSection } from "@/components/marketing/TeamSection";
import { LocationsSection } from "@/components/marketing/LocationsSection";
import { getCurrentUser } from "@/lib/auth/guards";
import styles from "./home.module.css";

/**
 * Ahana homepage.
 *
 * Reads the session only to choose which header to render — the page itself
 * is fully public and gates nothing.
 */
export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className={styles.page}>
      <a className="ahana-skip-link" href="#main-content">
        Skip to main content
      </a>

      <AppHeader isAuthenticated={Boolean(user)} />

      <main id="main-content">
        <Hero />
        <TrustBand />
        <FounderSection />
        <ServicesSection />
        <LetsTalkSection />
        <ResourcesSection />
        <TeamSection />
        <LocationsSection />
      </main>

      <AppFooter />
    </div>
  );
}
