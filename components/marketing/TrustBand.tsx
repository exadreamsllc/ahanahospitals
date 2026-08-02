import Image from "next/image";
import styles from "./TrustBand.module.css";

/** Campus photograph band that follows the hero on the approved V2 site. */
export function TrustBand() {
  return (
    <section className={styles.band}>
      <div className="ahana-container">
        <div className={styles.frame}>
          <Image
            src="/assets/hospital.webp"
            alt="The Ahana Hospitals campus in Madurai"
            width={611}
            height={344}
            className={styles.image}
            priority
          />
        </div>
      </div>
    </section>
  );
}
