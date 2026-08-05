import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { FounderSection } from "@/components/marketing/FounderSection";
import { Hero } from "@/components/marketing/Hero";
import { LetsTalkSection } from "@/components/marketing/LetsTalkSection";
import { ResourcesSection } from "@/components/marketing/ResourcesSection";
import { ServicesSection } from "@/components/marketing/ServicesSection";
import { TrustBand } from "@/components/marketing/TrustBand";

export default function HomePage() {
  return (
    <div>
      <a className="ahana-skip-link" href="#main-content">
        Skip to main content
      </a>
      <AppHeader />
      <main id="main-content">
        <Hero />
        <TrustBand />
        <ServicesSection />
        <FounderSection />
        <ResourcesSection />
        <LetsTalkSection />
      </main>
      <AppFooter />
    </div>
  );
}
