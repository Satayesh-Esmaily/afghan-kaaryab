import type { Metadata, Viewport } from "next";
import Providers from "@/components/layout/Providers";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "KaarYab Afghanistan",
    template: "%s | KaarYab Afghanistan",
  },
  description:
    "A modern opportunity finder platform for Afghan youth to browse jobs, internships, scholarships, remote work, and skill-building opportunities.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/logos/kaaryab-logo.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#6E5BFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-[color:var(--background)] text-[color:var(--foreground)]"
      >
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
