import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/schemas";

const RESEND_API_URL = "https://api.resend.com/emails";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please check the contact form fields and try again.",
      },
      { status: 400 }
    );
  }

  const to = process.env.CONTACT_TO_EMAIL || "hello@kaaryab.af";
  const from = process.env.CONTACT_FROM_EMAIL || "KaarYab Afghanistan <no-reply@kaaryab.af>";
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return NextResponse.json(
      {
        ok: false,
        message: "Email delivery is not configured yet. Please add RESEND_API_KEY in .env.local.",
      },
      { status: 500 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `[KaarYab Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2 style="margin: 0 0 16px;">New contact message from KaarYab</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <div style="white-space: pre-wrap; background: #f7f7f8; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px;">
            ${escapeHtml(message)}
          </div>
        </div>
      `,
      text: [
        "New contact message from KaarYab",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    return NextResponse.json(
      {
        ok: false,
        message: "We could not send your message right now. Please try again later.",
        details: errorText || undefined,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks. Your message has been sent to the KaarYab team.",
  });
}
