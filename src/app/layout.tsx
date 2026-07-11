import type { Metadata } from "next";
import { Spline_Sans, Spline_Sans_Mono } from "next/font/google";
import Providers from "@/components/layout/Providers";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";

const splineSans = Spline_Sans({
  variable: "--font-spline-sans",
  subsets: ["latin"],
});

const splineMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KaarYab Afghanistan",
    template: "%s | KaarYab Afghanistan",
  },
  description:
    "A modern opportunity finder platform for Afghan youth to browse jobs, internships, scholarships, remote work, and skill-building opportunities.",
  icons: {
    icon: "/logos/kaaryab-logo.png",
    shortcut: "/logos/kaaryab-logo.png",
    apple: "/logos/kaaryab-logo.png",
  },
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
      className={`${splineSans.variable} ${splineMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[color:var(--background)] text-[color:var(--foreground)]">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
