import Link from "next/link";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import { ROUTES } from "@/lib/constants/site";
import styles from "./saas.module.css";

export const metadata = {
  title: "YouMeCareAll | Custom Branded Patient Portals for Hospitals",
  description:
    "Empower your hospital or clinic with a secure, multilingual patient portal, digital callback forms, and custom reporting.",
};

const SAAS_FEATURES = [
  {
    icon: "📚",
    title: "Patient Knowledge Centre",
    description:
      "Share public brochures, guides, videos, and institutional stories. Patients can access medical knowledge center resources safely with no clinical record exposure.",
  },
  {
    icon: "🔖",
    title: "Personal Library Bookmarks",
    description:
      "Patients can save critical healthcare articles and admission brochures to their personal accounts using optimistic offline-resilient UI toggles.",
  },
  {
    icon: "📞",
    title: "Digital Contact & Callback Intake",
    description:
      "A validation-resilient digital intake form that logs contact requests and triggers redirection templates for direct WhatsApp communication.",
  },
  {
    icon: "📊",
    title: "Custom Staff Reporting Builder",
    description:
      "Authorize hospital staff to generate custom reports. Select fields, set search filters, and configure physical print layouts with clean CSS page-breaks.",
  },
  {
    icon: "🌐",
    title: "Multilingual Core",
    description:
      "Serve local communities with native translations. Read and explore the portal in English, Tamil, and other regional languages instantly.",
  },
  {
    icon: "🛡️",
    title: "DPDP Act & RLS Security",
    description:
      "Rest assured with strict Row-Level Security (RLS) policies and complete database tenant isolation conforming to India's DPDP Act guidelines.",
  },
] as const;

const SUBSCRIPTIONS = [
  {
    name: "Starter (Clinic)",
    price: "$49",
    features: [
      "Shared subdomain (clinic.youmecareall.com)",
      "Standard Patient Library (up to 10 files)",
      "Intake contact forms",
      "Email support (24h response)",
      "Secure Supabase authentication",
    ],
    popular: false,
    cta: "Start Clinic Trial",
  },
  {
    name: "Growth (Hospital)",
    price: "$199",
    features: [
      "Custom branded domain integration",
      "Branding configurations (logos & colors)",
      "Multilingual translation support",
      "Intake forms & WhatsApp redirection",
      "Dedicated account manager support",
    ],
    popular: true,
    cta: "Start Hospital Trial",
  },
  {
    name: "Enterprise (Network)",
    price: "Custom",
    features: [
      "Unlimited branch location profiles",
      "Custom Staff Reports Builder",
      "Dedicated database server cluster",
      "API integrations with hospital EHR",
      "99.9% uptime SLA guarantee",
    ],
    popular: false,
    cta: "Contact Sales",
  },
] as const;

export default function SaasLandingPage() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.logo}>
            YouMeCareAll
          </Link>
          <nav>
            <SecondaryLink href={ROUTES.login} appearance="button">
              Hospital Login
            </SecondaryLink>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <span className={styles.tagline}>Introducing YouMeCareAll</span>
          <h1 className={styles.title}>
            Launch Your Hospital&apos;s Branded Patient Portal Instantly
          </h1>
          <p className={styles.subtitle}>
            Provide patients with a secure knowledge center, digital callback requests, and personal reading libraries. Manage operations with custom reporting. All in one DPDP-compliant platform.
          </p>
          <div className={styles.heroActions}>
            <PrimaryButton type="button" fullWidth={false}>
              Get Started Free
            </PrimaryButton>
            <SecondaryLink href="#features" appearance="button">
              See Features
            </SecondaryLink>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Everything Your Patients & Staff Need</h2>
          <p className={styles.sectionText}>
            A modern suite of patient engagement and administrative tools designed for hospitals and neuropsychiatric care centers.
          </p>
        </div>
        <div className={styles.grid}>
          {SAAS_FEATURES.map((feature) => (
            <div key={feature.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{feature.icon}</span>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Matrix */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.pricingContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Simple, Transparent Pricing</h2>
            <p className={styles.sectionText}>
              Choose the package that matches your healthcare facility size. No hidden fees. Cancel anytime.
            </p>
          </div>
          <div className={styles.pricingGrid}>
            {SUBSCRIPTIONS.map((tier) => (
              <div
                key={tier.name}
                className={`${styles.priceCard} ${
                  tier.popular ? styles.priceCardPopular : ""
                }`}
              >
                {tier.popular ? (
                  <span className={styles.popularBadge}>Most Popular</span>
                ) : null}
                <h3 className={styles.tierName}>{tier.name}</h3>
                <div className={styles.tierPrice}>
                  <span className={styles.amount}>{tier.price}</span>
                  {tier.price !== "Custom" ? (
                    <span className={styles.period}>/month</span>
                  ) : null}
                </div>
                <ul className={styles.featureList}>
                  {tier.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <PrimaryButton
                  type="button"
                  variant={tier.popular ? "primary" : "secondary"}
                >
                  {tier.cta}
                </PrimaryButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLogo}>YouMeCareAll</div>
          <p>© 2026 YouMeCareAll Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
