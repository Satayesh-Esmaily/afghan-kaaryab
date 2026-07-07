export default function ContactDetailsCard() {
  return (
    <div className="ds-card space-y-4 rounded-[1.5rem] p-6">
      <h2 className="ds-title text-xl font-semibold">Contact details</h2>
      <p className="ds-muted text-sm leading-7">
        This project version is a demo, so the form is intentionally local and safe to use during presentations.
      </p>
      <div className="space-y-3 text-sm text-[color:var(--foreground)]">
        <p>Email: hello@kaaryab.af</p>
        <p>Location: Afghanistan</p>
        <p>Purpose: opportunity discovery for youth and communities</p>
      </div>
    </div>
  );
}
