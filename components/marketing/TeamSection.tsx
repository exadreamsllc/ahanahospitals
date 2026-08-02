import { SectionHeading } from "./SectionHeading";
import { TeamScroller } from "./TeamScroller";
import { TEAM } from "@/lib/content/team";

/** "One team, standing with you" — the full care team. */
export function TeamSection() {
  return (
    <section className="ahana-section" id="team" aria-labelledby="team-heading">
      <div className="ahana-container">
        <SectionHeading
          eyebrow="Meet the people who care for you"
          title="One team, standing with you"
          id="team-heading"
          description={
            <p>
              Doctors, psychologists, social workers and caregivers working
              together with patients and families.
            </p>
          }
        />

        <TeamScroller members={TEAM} />
      </div>
    </section>
  );
}
