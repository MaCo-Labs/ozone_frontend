import Image from "next/image";
import styles from "./PageHero.module.css";

type PageHeroProps = {
  index: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  caption?: string;
};

export function PageHero({ index, title, intro, image, imageAlt, caption = "Sector reference imagery" }: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <span className={styles.index}>{index}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
      <div className={styles.media}>
        <Image src={image} alt={imageAlt} fill sizes="(max-width: 800px) 100vw, 52vw" className={styles.image} priority />
        <span className={styles.caption}>{caption}</span>
      </div>
    </section>
  );
}
