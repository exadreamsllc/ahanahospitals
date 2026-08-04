import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ahana Cloud Stack",
    short_name: "Ahana",
    description: "Multi-tenant clinical management and neuropsychiatric rehabilitation platform.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0b0813",
    theme_color: "#4C2E83",
    icons: [
      {
        src: "/assets/logo.webp",
        sizes: "192x192",
        type: "image/webp",
      },
      {
        src: "/assets/logo.webp",
        sizes: "512x512",
        type: "image/webp",
      },
    ],
  };
}
