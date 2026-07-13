import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KaarYab Afghanistan",
    short_name: "KaarYab",
    description: "A modern job platform for Afghan opportunities, resumes, and organizations.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F8F9FA",
    theme_color: "#6E5BFF",
    icons: [
      {
        src: "/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
