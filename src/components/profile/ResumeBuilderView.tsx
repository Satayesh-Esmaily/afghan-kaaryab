"use client";

import { useMemo, useState } from "react";
import { Badge, EmptyState, SectionHeading } from "@/components/ui";
import { authCopy } from "@/config/auth";
import { useAppData, type ResumeTemplateId } from "@/context/app-context";

const templates: Array<{
  id: ResumeTemplateId;
  label: string;
  description: string;
}> = [
  { id: "classic", label: "Classic", description: "Simple and formal for offices and NGOs." },
  { id: "modern", label: "Modern", description: "Balanced layout with strong visual hierarchy." },
  { id: "compact", label: "Compact", description: "Tighter layout for short CVs and fresh graduates." },
];

export default function ResumeBuilderView() {
  const { authenticated, profile, updateProfile, user } = useAppData();
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateId>(
    profile.resumeTemplate ?? "modern"
  );

  const skills = useMemo(
    () =>
      profile.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [profile.skills]
  );

  if (!authenticated) {
    return (
      <EmptyState
        title="Sign in to build your resume"
        description="Create your CV, choose a template, and export it as PDF after logging in."
        actionHref="/login"
        actionLabel={authCopy.loginButtonLabel}
      />
    );
  }

  const applyTemplate = (template: ResumeTemplateId) => {
    setSelectedTemplate(template);
    updateProfile({ resumeTemplate: template });
  };

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Resume Builder"
        title="Create a CV without Word"
        description="Build your resume, choose a template, and save it as a PDF for applications."
      />

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr] print:block">
        <div className="space-y-5 print:hidden">
          <div className="rounded-[1.5rem] panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--foreground-muted)]">
              Choose a template
            </p>
            <div className="mt-5 grid gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => applyTemplate(template.id)}
                  className={[
                    "rounded-[1.25rem] border px-4 py-4 text-left transition",
                    selectedTemplate === template.id
                      ? "border-transparent active-pill"
                      : "border-[color:var(--border)] bg-[color:var(--surface)] hover:bg-[color:var(--surface-soft)]",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{template.label}</p>
                      <p className="mt-1 text-sm text-[color:var(--foreground-muted)]">{template.description}</p>
                    </div>
                    {selectedTemplate === template.id ? <Badge tone="accent">Selected</Badge> : null}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] accent-panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
              Export
            </p>
            <h3 className="mt-3 text-2xl font-semibold">Save it as a PDF.</h3>
            <p className="mt-3 text-sm leading-7 text-white/85">
              Open the print dialog to download your resume as a PDF file.
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-5 inline-flex rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[color:var(--accent)] transition hover:bg-white/90"
            >
              Download PDF
            </button>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-white p-6 shadow-sm print:border-0 print:p-0">
          <div
            className={[
              "overflow-hidden rounded-[1.5rem]",
              selectedTemplate === "classic"
                ? "bg-[#f7f4ef]"
                : selectedTemplate === "compact"
                  ? "bg-[#f3f7ff]"
                  : "bg-[#f7f7fb]",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4 border-b border-black/5 px-6 py-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/45">
                  KaarYab Afghanistan
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-black">{profile.fullName}</h2>
                <p className="mt-2 text-sm text-black/70">{profile.headline}</p>
              </div>
              <Badge tone="default">{user?.email ?? "Candidate profile"}</Badge>
            </div>

            <div className="grid gap-6 px-6 py-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-5">
                <ResumePanel title="Contact">
                  <ProfileLine label="Location" value={profile.location} />
                  <ProfileLine label="Phone" value={profile.phone || "Not added"} />
                  <ProfileLine label="Email" value={user?.email ?? "Not added"} />
                </ResumePanel>

                <ResumePanel title="Skills">
                  <TagWrap items={skills.length > 0 ? skills : ["Add your skills"]} />
                </ResumePanel>

                <ResumePanel title="Languages">
                  <p className="text-sm leading-7 text-black/75">{profile.languages}</p>
                </ResumePanel>
              </div>

              <div className="space-y-5">
                <ResumePanel title="Summary">
                  <p className="text-sm leading-7 text-black/75">{profile.bio}</p>
                </ResumePanel>

                <ResumePanel title="Experience">
                  <p className="text-sm leading-7 text-black/75 whitespace-pre-line">{profile.experience}</p>
                </ResumePanel>

                <ResumePanel title="Education">
                  <p className="text-sm leading-7 text-black/75 whitespace-pre-line">{profile.education}</p>
                </ResumePanel>

                <ResumePanel title="Documents and links">
                  <div className="space-y-2 text-sm text-black/75">
                    <ProfileLine label="Resume" value={profile.resumeUrl || "Not added"} />
                    <ProfileLine label="Portfolio" value={profile.portfolioUrl || "Not added"} />
                    <ProfileLine label="Video intro" value={profile.introVideoUrl || "Not added"} />
                    <ProfileLine label="Documents" value={profile.documents} />
                  </div>
                </ResumePanel>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ResumePanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.35rem] border border-black/5 bg-white/70 px-5 py-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-black/45">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ProfileLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-2.5 last:border-b-0 last:pb-0">
      <span className="text-sm text-black/55">{label}</span>
      <span className="max-w-[60%] text-right text-sm font-medium text-black">{value}</span>
    </div>
  );
}

function TagWrap({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/75">
          {item}
        </span>
      ))}
    </div>
  );
}
