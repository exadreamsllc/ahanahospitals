import type { Metadata } from "next";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import styles from "../public-pages.module.css";

export const metadata: Metadata = {
  title: "Resources",
  description: "Marketing campaigns, mental-health awareness campaigns and educational resources from Ahana.",
};

const COLLECTIONS = [
  {
    title: "Marketing campaigns",
    status: "Collection foundation",
    text: "Hospital introductions, service campaigns, community announcements and approved brand material.",
  },
  {
    title: "Awareness campaigns",
    status: "Collection foundation",
    text: "Plain-language material that challenges stigma and helps people recognise when support may be useful.",
  },
  {
    title: "Videos and talks",
    status: "English and Tamil",
    text: "Welcome messages, expert conversations, public talks and educational sessions from Ahana's team.",
  },
  {
    title: "Family and caregiver guides",
    status: "In preparation",
    text: "Practical resources for families, caregivers and volunteers supporting someone through recovery.",
  },
  {
    title: "Community programmes",
    status: "Archive foundation",
    text: "Stories and documentation from rehabilitation, inclusion and community mental-health initiatives.",
  },
  {
    title: "Publications and research",
    status: "In preparation",
    text: "Reviewed articles, institutional publications and research material for public learning.",
  },
];

export default function ResourcesPage() {
  return (
    <div className={styles.page}>
      <AppHeader />
      <main className={styles.main}>
        <div className="ahana-container">
          <header className={styles.intro}>
            <span className="ahana-eyebrow">Resources</span>
            <h1 className="ahana-display">Campaigns, awareness and shared learning</h1>
            <p>A simple knowledge centre for material that helps people understand Ahana, mental health and the role of families and communities.</p>
          </header>

          <section aria-labelledby="collections-title">
            <h2 id="collections-title">Resource collections</h2>
            <ul className={styles.grid}>
              {COLLECTIONS.map((collection) => (
                <li className={styles.card} key={collection.title}>
                  <span className={styles.tag}>{collection.status}</span>
                  <h3>{collection.title}</h3>
                  <p>{collection.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <p className={styles.note}>Only reviewed and approved Ahana material will be published. Campaign files can be added to these collections in the next content pass.</p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
