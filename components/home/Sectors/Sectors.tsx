import styles from "./Sectors.module.css";

const SECTORS = [
  {
    name: "Transit & Aviation",
    reference: "Qatar Rail · Hamad International Airport",
  },
  {
    name: "Healthcare",
    reference: "Maestro Dental Centre · Doha Clinic Hospital",
  },
  {
    name: "Corporate & Commercial",
    reference: "Apparel Group Head Office · Ezdan Holding",
  },
  {
    name: "Retail & F&B",
    reference: "Tim Hortons · Malabar Gold & Diamonds · Karak Stop",
  },
];

export function Sectors() {
  return (
    <section className={styles.sectors} aria-labelledby="sectors-heading">
      <div className={styles.inner}>
        <h2 id="sectors-heading" className={styles.heading}>
          SECTORS WE SERVE
        </h2>
        <ul className={styles.list}>
          {SECTORS.map((sector) => (
            <li key={sector.name} className={styles.item}>
              <h3 className={styles.name}>{sector.name}</h3>
              <p className={styles.reference}>{sector.reference}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
