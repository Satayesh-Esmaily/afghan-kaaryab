import { contactCopy } from "@/config/contact";

export default function ContactDetailsCard() {
  return (
    <div className="ds-card space-y-4 rounded-[1.5rem] p-6">
      <h2 className="ds-title text-xl font-semibold">{contactCopy.detailsTitle}</h2>
      <p className="ds-muted text-sm leading-7">
        {contactCopy.detailsDescription}
      </p>
      <div className="space-y-3 text-sm text-[color:var(--foreground)]">
        <p>Email: {contactCopy.email}</p>
        <p>Location: {contactCopy.location}</p>
        <p>Purpose: {contactCopy.purpose}</p>
      </div>
    </div>
  );
}
