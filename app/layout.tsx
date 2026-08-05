import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_THEME_COLOR,
  SITE_TITLE,
} from "@/lib/constants/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: SITE_THEME_COLOR,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalOrganization",
              "name": "Ahana Hospitals",
              "alternateName": "M.S. Chellamuthu Trust & Research Foundation",
              "url": "https://www.dotheneeds.com",
              "logo": "https://www.dotheneeds.com/assets/logo.webp",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9600314219",
                "contactType": "emergency helpline",
                "areaServed": "IN",
                "availableLanguage": ["English", "Tamil"]
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Madurai",
                "addressRegion": "Tamil Nadu",
                "addressCountry": "IN"
              }
            })
          }}
        />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('pageshow', (event) => {
                const isBackForward = event.persisted || 
                  (window.performance && window.performance.navigation && window.performance.navigation.type === 2) ||
                  (window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType("navigation")[0]?.type === "back_forward");
                if (isBackForward) {
                  window.location.reload();
                }
              });
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then((reg) => {
                    console.log('SW registered successfully:', reg.scope);
                  }).catch((err) => {
                    console.error('SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
