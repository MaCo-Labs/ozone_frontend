import { describe, expect, it } from "vitest";
import { buildWhatsAppEnquiry } from "./whatsapp";

describe("WhatsApp project enquiries", () => {
  const enquiry = { name: "  Amira  ", company: "A&B Design", email: "amira@example.com", phone: "+974 5555 1234", project: "Interior fit-out", message: "Doha office\nScope: joinery & MEP + finishes?" };

  it("addresses the published Qatar number and preserves punctuation and line breaks", () => {
    const url = new URL(buildWhatsAppEnquiry(enquiry));
    expect(url.origin + url.pathname).toBe("https://wa.me/97433307095");
    const message = url.searchParams.get("text")!;
    expect(message).toContain("*Name:* Amira\n");
    expect(message).toContain("*Company:* A&B Design");
    expect(message).toContain(enquiry.message);
    expect(message).toContain("*Email:* amira@example.com");
    expect(message).toContain("*Phone:* +974 5555 1234");
  });

  it("omits unprovided optional details and gives a clear service fallback", () => {
    const message = new URL(buildWhatsAppEnquiry({ ...enquiry, company: " ", phone: "", project: "" })).searchParams.get("text")!;
    expect(message).not.toContain("*Company:*");
    expect(message).not.toContain("*Phone:*");
    expect(message).toContain("*Service:* To be discussed");
  });
});
