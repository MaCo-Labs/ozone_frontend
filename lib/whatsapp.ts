import { CONTACT } from "./siteData";

export type ProjectEnquiry = {
  name: string;
  company: string;
  email: string;
  phone: string;
  project: string;
  message: string;
};

export function buildWhatsAppEnquiry(enquiry: ProjectEnquiry): string {
  const clean = (value: string) => value.trim();
  const message = [
    "*PROJECT ENQUIRY | OZONE*",
    "",
    "Dear OZONE team,",
    "I would like to discuss the following project.",
    "",
    `*Name:* ${clean(enquiry.name)}`,
    ...(clean(enquiry.company) ? [`*Company:* ${clean(enquiry.company)}`] : []),
    `*Email:* ${clean(enquiry.email)}`,
    ...(clean(enquiry.phone) ? [`*Phone:* ${clean(enquiry.phone)}`] : []),
    `*Service:* ${clean(enquiry.project) || "To be discussed"}`,
    "",
    "*Project brief*",
    clean(enquiry.message),
    "",
    "Please advise on the next steps and a suitable time to discuss the scope.",
    "Thank you.",
    "",
    "Enquiry prepared via the OZONE website.",
  ].join("\n");
  return `https://wa.me/${CONTACT.phones[0].replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
