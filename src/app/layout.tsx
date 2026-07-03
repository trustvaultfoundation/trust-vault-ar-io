import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// The trustvault.ar.io landing (shopfront). The full app lives on trustvault.foundation.
const SITE_URL = "https://trustvault.ar.io";
const SITE_NAME = "TrustVault";
const DESCRIPTION =
  "TrustVault is the all-in-one, end-to-end encrypted workspace — boards, timesheet, a service desk, docs, chat, calendar and a document vault — free to use and stored permanently on Arweave.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TrustVault — Encrypted workspace, kept forever",
    template: "%s · TrustVault",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "encrypted workspace",
    "end-to-end encryption",
    "Arweave",
    "permanent storage",
    "document vault",
    "kanban board",
    "service desk",
    "team collaboration",
    "decentralized",
    "Wander wallet",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "productivity",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "TrustVault — Encrypted workspace, kept forever",
    description: DESCRIPTION,
    locale: "en_US",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "TrustVault — the all-in-one encrypted workspace" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustVault — Encrypted workspace, kept forever",
    description: DESCRIPTION,
    images: ["/og.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://trustvault.foundation",
  description: DESCRIPTION,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100" suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        {children}
      </body>
    </html>
  );
}
