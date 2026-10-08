import styles from "./Intro.module.css";

export function Intro() {
  return (
    <section className={styles.intro} aria-labelledby="intro-heading">
      <div className={styles.inner}>
        <h2 id="intro-heading" className={styles.heading}>
          BUILT AROUND
          <br />
          HOW SPACES WORK.
        </h2>
        <div className={styles.copy}>
          <p>
            OZONE Fitout &amp; Contracting W.L.L., established in 2014 and rebranded in
            2021, has built a reputation for delivering projects with precision,
            reliability, and timely execution. Backed by a team of experienced
            professionals and the latest construction technologies, the company
            consistently exceeds client expectations through exceptional workmanship
            and integrated project delivery.
          </p>
          <p>
            With its expanding presence in Qatar and the Kingdom of Bahrain, OZONE
            remains committed to the highest standards of quality, safety, innovation,
            and customer satisfaction. We create spaces that are functional,
            sustainable, and built to last.
          </p>
        </div>
      </div>
      <div className={styles.pillars}>
        <div className={styles.pillar}>
          <h3 className={styles.pillarLabel}>Our Mission</h3>
          <p>
            To become the preferred choice for fit-out and contracting solutions,
            delivering exceptional value by exceeding client expectations while
            maintaining the highest standards of quality, safety, integrity,
            sustainability, and regulatory compliance.
          </p>
        </div>
        <div className={styles.pillar}>
          <h3 className={styles.pillarLabel}>Our Vision</h3>
          <p>
            We transform ideas into reliable solutions through innovation, precision,
            and professional expertise. We deliver excellence, build trust, and
            creating lasting value for every client.
          </p>
        </div>
      </div>
    </section>
  );
}
