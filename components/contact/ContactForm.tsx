"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { buildWhatsAppEnquiry } from "@/lib/whatsapp";
import styles from "./ContactForm.module.css";

export function ContactForm({ projectName }: { projectName?: string } = {}) {
  const [error, setError] = useState("");
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const company = String(form.get("company") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const project = String(form.get("project") ?? "");
    const message = String(form.get("message") ?? "");
    if (!name.trim() || !message.trim()) {
      setError("Please enter your name and a project brief.");
      return;
    }
    setError("");
    window.location.assign(buildWhatsAppEnquiry({ name, company, email, phone, project, message }));
  }

  return (
    <form className={`${styles.form} ${projectName ? styles.projectForm : ""}`} onSubmit={handleSubmit}>
      <div className={styles.twoCol}>
        <label>
          <span>Name</span>
          <input name="name" autoComplete="name" maxLength={100} required />
        </label>
        <label>
          <span>Company</span>
          <input name="company" autoComplete="organization" maxLength={150} />
        </label>
      </div>
      <div className={styles.twoCol}>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" maxLength={254} required />
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
      </div>
      <label>
        <span>Project type</span>
        <select name="project" defaultValue="">
          <option value="" disabled>Select a discipline</option>
          <option>Interior fit-out</option>
          <option>Contracting &amp; construction</option>
          <option>MEP services</option>
          <option>Engineering consultancy &amp; design</option>
          <option>Integrated project</option>
        </select>
      </label>
      <label>
        <span>Project brief</span>
        <textarea name="message" rows={5} maxLength={2000} placeholder="Location, scope, programme, and anything already decided." defaultValue={projectName ? `I'd like to discuss a project similar to ${projectName}.\n\n` : undefined} required />
      </label>
      <p>WhatsApp opens with your enquiry addressed to OZONE at +974 3330 7095. Review the message and tap Send. <Link href="/privacy">Privacy information</Link></p>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <button type="submit">Continue on WhatsApp <span aria-hidden="true">↗</span></button>
    </form>
  );
}
