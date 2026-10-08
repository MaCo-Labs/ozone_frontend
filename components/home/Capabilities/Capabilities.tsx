import styles from "./Capabilities.module.css";

const DOMAINS = [
  {
    number: "01",
    name: "Interior Fit-Out",
    description:
      "Creating functional, elegant, and well-crafted interior spaces with a focus on quality, precision, and modern design.",
    scope: [
      "Corporate Office Fit-Outs",
      "Commercial & Retail Interiors",
      "Hospitality & F&B Fit-Outs",
      "Luxury Residential Interiors",
      "Joinery & Bespoke Carpentry",
      "Ceiling, Partition & Finishing Works",
      "Furniture, Fixtures & Equipment (FF&E)",
      "Turnkey Interior Solutions",
      "Complete Flooring Solutions",
    ],
  },
  {
    number: "02",
    name: "Contracting & Construction",
    description:
      "Delivering reliable construction solutions with a commitment to quality, efficiency, and excellence.",
    scope: [
      "General Contracting",
      "Design & Build Solutions",
      "Civil & Structural Construction",
      "Commercial & Residential Developments",
      "Building Renovation & Refurbishment",
      "Concrete & Finishing Works",
      "Infrastructure & External Works",
    ],
  },
  {
    number: "03",
    name: "MEP Services",
    description:
      "Delivering reliable engineering solutions with precision, quality, and a commitment to excellence.",
    scope: [
      "Mechanical Engineering Systems",
      "Electrical Power & Lighting Systems",
      "Plumbing & Public Health Engineering",
      "Heating, Ventilation & Air Conditioning (HVAC)",
      "Fire Protection & Life Safety Systems",
      "Low Current & ELV Systems",
      "Testing, Commissioning & Handover",
      "Operation & Maintenance Support",
    ],
  },
  {
    number: "04",
    name: "Engineering Consultancy & Design",
    description:
      "Delivering innovative engineering solutions through strategic planning, technical expertise, and design excellence.",
    scope: [
      "Architectural Design Consultancy",
      "Structural Engineering Solutions",
      "MEP Engineering Design",
      "BIM Modelling & Coordination",
      "Technical Design & Shop Drawings",
      "Project Planning & Cost Consultancy",
      "Project Management Consultancy (PMC)",
    ],
  },
];

export function Capabilities() {
  return (
    <section className={styles.capabilities} aria-labelledby="capabilities-heading">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>ONE PROJECT. MULTIPLE DISCIPLINES.</p>
        <h2 id="capabilities-heading" className={styles.heading}>
          What we deliver
        </h2>
        <ul className={styles.grid}>
          {DOMAINS.map((domain) => (
            <li key={domain.name} className={styles.card}>
              <span className={styles.number}>{domain.number}</span>
              <h3 className={styles.name}>{domain.name}</h3>
              <p className={styles.description}>{domain.description}</p>
              <ul className={styles.scope}>
                {domain.scope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
