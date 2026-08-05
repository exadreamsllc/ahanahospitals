import type { Metadata } from "next";
import Image from "next/image";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { FOUNDER, FOUNDER_BIOGRAPHY } from "@/lib/content/founder";
import styles from "../public-pages.module.css";

export const metadata: Metadata = {
  title: "Our Founder",
  description: "Dr. C. Ramasubramanian, Mrs. Rani, the founding family and Ahana's volunteers.",
};

const PEOPLE = [
  {
    name: "Dr. C. Ramasubramanian",
    role: "Founder and mental-health advocate",
    text: FOUNDER.summary,
  },
  {
    name: "Mrs. Rani",
    role: "Founding family",
    text: "A dedicated part of the family story behind Ahana. Her approved biography and photographs will be added with the family's review.",
  },
  {
    name: "Family members",
    role: "Continuing the mission",
    text: "The family continues to support Ahana's commitment to dignity, rehabilitation and care that extends beyond the hospital.",
  },
  {
    name: "Volunteers",
    role: "Community partners",
    text: "Volunteers help carry awareness, inclusion and practical support into the communities Ahana serves.",
  },
];

export default function FounderPage() {
  return (
    <div className={styles.page}>
      <AppHeader />
      <main className={styles.main}>
        <div className="ahana-container">
          <header className={styles.intro}>
            <span className="ahana-eyebrow">Our founder</span>
            <h1 className="ahana-display">A family mission built around dignity and hope</h1>
            <p>The people, relationships and community spirit behind Ahana Hospitals.</p>
          </header>

          <section className={styles.card} aria-labelledby="crs-title">
            <div style={{display:"grid", gridTemplateColumns:"minmax(180px, 280px) 1fr", gap:"28px", alignItems:"center"}}>
              <Image src={FOUNDER.portrait} alt={`Portrait of ${FOUNDER.name}`} width={720} height={1080} style={{width:"100%", height:"auto", borderRadius:"18px"}} priority />
              <div>
                <span className={styles.tag}>{FOUNDER.title}</span>
                <h2 id="crs-title">{FOUNDER.name}</h2>
                {FOUNDER_BIOGRAPHY.slice(0, 2).map((paragraph) => <p key={paragraph.slice(0, 28)} style={{marginTop:"12px"}}>{paragraph}</p>)}
              </div>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="people-title">
            <h2 id="people-title">The people who carry the mission</h2>
            <ul className={styles.grid}>
              {PEOPLE.map((person) => (
                <li className={styles.card} key={person.name}>
                  <span className={styles.tag}>{person.role}</span>
                  <h3>{person.name}</h3>
                  <p>{person.text}</p>
                </li>
              ))}
            </ul>
            <p className={styles.note}>Family names, roles, dates and personal stories will be published only after approval from Ahana and the family.</p>
          </section>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
