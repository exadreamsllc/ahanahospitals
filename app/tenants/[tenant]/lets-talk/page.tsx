import type { Metadata } from "next";
import { MemberShell } from "@/components/layout/MemberShell";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { AlertMessage } from "@/components/ui/AlertMessage";
import { getCurrentUser } from "@/lib/auth/guards";
import { getDisplayName } from "@/lib/auth/user";
import { CONTACT, EMERGENCY_NOTICE } from "@/lib/content/contact";
import { CallbackForm } from "./CallbackForm";
import styles from "./lets-talk.module.css";

export const metadata: Metadata = {
  title: "Let's Talk",
  description:
    "Start a confidential conversation with the Ahana Hospitals team.",
};

const CHANNELS = [
  {
    id: "call",
    label: "Call us",
    detail: CONTACT.phoneDisplay,
    href: CONTACT.phoneHref,
    description:
      "The fastest way to reach us. Our helpdesk will guide you to the right service.",
    available: true,
  },
  {
    id: "email",
    label: "Email us",
    detail: CONTACT.email,
    href: CONTACT.emailHref,
    description:
      "Write to us and we will respond. Please avoid sharing detailed medical information by email.",
    available: true,
  },
  {
    id: "callback",
    label: "Request a callback",
    detail: "Choose a time that suits you",
    href: "#callback-form",
    description:
      "Tell us when you are free and a member of the team will call you back.",
    available: true,
  },
  {
    id: "chat",
    label: "Guided support",
    detail: "Answer a few questions",
    description:
      "A short guided flow to help you describe what is happening and find the right next step.",
    available: false,
  },
] as const;

const STEPS = [
  {
    number: "01",
    title: "You reach out",
    description:
      "By phone, by email, or through this page. You do not need to have the words ready.",
  },
  {
    number: "02",
    title: "We listen",
    description:
      "A first conversation to understand what is happening, for you or for someone you care about.",
  },
  {
    number: "03",
    title: "We find the next step",
    description:
      "An appointment, a service, or simply guidance. There is no obligation to continue.",
  },
] as const;

/**
 * Let's Talk — contact and intake experience.
 *
 * This release enables database-backed intake for callback requests.
 */
export default async function LetsTalkPage() {
  const user = await getCurrentUser();
  const displayName = user ? getDisplayName(user) : "";

  return (
    <MemberShell
      title="Let's Talk"
      description="Reaching out is a sign of strength. Here is how to start a conversation with us."
      isAuthenticated={Boolean(user)}
    >
      <div className={styles.stack}>
        <AlertMessage variant="error" title="If someone is in immediate danger">
          <p>
            {EMERGENCY_NOTICE} You can also call Ahana directly on{" "}
            <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a> for guidance.
          </p>
        </AlertMessage>

        <section aria-labelledby="channels-heading">
          <SectionHeading
            eyebrow="Ways to reach us"
            title="Pick whichever feels easiest"
            id="channels-heading"
          />

          <ul className={`ahana-list-reset ${styles.channels}`}>
            {CHANNELS.map((channel) => (
              <li
                key={channel.id}
                className={`${styles.channel} ${
                  channel.available ? "" : styles.channelPending
                }`}
              >
                <h3 className={styles.channelLabel}>{channel.label}</h3>

                {channel.available && "href" in channel ? (
                  <a className={styles.channelDetail} href={channel.href}>
                    {channel.detail}
                  </a>
                ) : (
                  <span className={styles.channelDetail}>{channel.detail}</span>
                )}

                <p className={styles.channelDescription}>
                  {channel.description}
                </p>

                {channel.available ? null : (
                  <span className={styles.badge}>Coming soon</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section id="callback-form" style={{ scrollMarginTop: "var(--ahana-space-6)" }}>
          <CallbackForm initialName={displayName} />
        </section>

        <section aria-labelledby="steps-heading">
          <SectionHeading
            eyebrow="What happens next"
            title="Three steps, at your pace"
            id="steps-heading"
          />

          <ol className={`ahana-list-reset ${styles.steps}`}>
            {STEPS.map((step) => (
              <li key={step.number} className={styles.step}>
                <span aria-hidden="true" className={styles.stepNumber}>
                  {step.number}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={`ahana-panel ${styles.privacy}`}>
          <h2 className={styles.privacyTitle}>Your privacy</h2>
          <p>
            Conversations with Ahana are confidential. This website does not
            store clinical notes, diagnoses or treatment history, and nothing
            you send through it becomes part of a medical record.
          </p>
          <p className="ahana-muted">
            For your own privacy, please avoid sharing detailed medical
            information through unsecured messages.
          </p>
        </section>
      </div>
    </MemberShell>
  );
}
