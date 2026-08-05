import type { Metadata } from "next";
import { AppFooter } from "@/components/layout/AppFooter";
import { AppHeader } from "@/components/layout/AppHeader";
import { CONTACT, EMERGENCY_NOTICE } from "@/lib/content/contact";
import styles from "../public-pages.module.css";

export const metadata: Metadata = {
  title: "Let's Talk",
  description: "Ways to talk with Ahana online, by phone, through guided support, or in person.",
};

const OPTIONS = [
  {
    title: "Call Ahana",
    status: "Available now",
    text: "Speak with the helpdesk and find the most appropriate next step.",
    href: CONTACT.phoneHref,
    action: CONTACT.phoneDisplay,
  },
  {
    title: "Email",
    status: "Available now",
    text: "Send a general enquiry without including detailed medical information.",
    href: CONTACT.emailHref,
    action: CONTACT.email,
  },
  {
    title: "Online or in-person session",
    status: "Request a session",
    text: "Ask the team about appointment availability and the right format for your needs.",
    href: CONTACT.phoneHref,
    action: "Contact the helpdesk",
  },
  {
    title: "Community forum",
    status: "Foundation stage",
    text: "A moderated space for general support and shared learning. It will not replace clinical care.",
  },
  {
    title: "Automated text guidance",
    status: "Coming next",
    text: "A short guided flow to help visitors organise their thoughts before contacting Ahana.",
  },
  {
    title: "Ahana chatbot",
    status: "Coming next",
    text: "General navigation and service information, with clear escalation to a human team member.",
  },
];

export default function LetsTalkPage() {
  return (
    <div className={styles.page}>
      <AppHeader />
      <main className={styles.main}>
        <div className="ahana-container">
          <header className={styles.intro}>
            <span className="ahana-eyebrow">Let&apos;s Talk</span>
            <h1 className="ahana-display">Start in the way that feels easiest</h1>
            <p>You do not need to have the right words ready. Choose a way to reach Ahana, and the team will help you understand the next step.</p>
          </header>

          <section aria-labelledby="options-title">
            <h2 id="options-title">Ways to connect</h2>
            <ul className={styles.grid}>
              {OPTIONS.map((option) => (
                <li className={styles.card} key={option.title}>
                  <span className={styles.tag}>{option.status}</span>
                  <h3>{option.title}</h3>
                  <p>{option.text}</p>
                  {option.href ? <div className={styles.actions}><a className={styles.action} href={option.href}>{option.action}</a></div> : null}
                </li>
              ))}
            </ul>
          </section>

          <aside className={styles.note}>
            <strong>If someone may be in immediate danger:</strong> {EMERGENCY_NOTICE} You can also call Ahana directly at <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a> for guidance.
          </aside>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
