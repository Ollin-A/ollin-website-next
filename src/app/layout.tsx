import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "@/styles/globals.css";
import LeadModalProvider from "@/components/lead/LeadModalProvider";
import Navbar from "@/components/layout/Navbar";
import ConditionalOutro from "@/components/layout/ConditionalOutro";
import StructuredData from "@/components/ui/StructuredData";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "OLLIN \u2014 Design & Systems", template: "%s \u2014 OLLIN" },
  description:
    "More calls and estimates\u2014then we turn them into booked jobs with a better website, faster replies, and automatic follow-ups.",
  metadataBase: new URL("https://ollin.agency"),
  openGraph: {
    title: "OLLIN \u2014 Design & Systems",
    description:
      "More calls and estimates\u2014then we turn them into booked jobs with a better website, faster replies, and automatic follow-ups.",
    url: "https://ollin.agency",
    siteName: "OLLIN Agency",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OLLIN \u2014 Design & Systems",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <body>
        <LeadModalProvider>
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "OLLIN Agency",
              url: "https://ollin.agency",
              logo: "https://ollin.agency/favicon-32.png",
              description:
                "Marketing agency for U.S. contractors \u2014 websites, ads, Google Maps, follow-up systems, and AI-powered lead handling. English and Spanish.",
              email: "contact@ollin.agency",
              telephone: "+526692740503",
              address: {
                "@type": "PostalAddress",
                addressCountry: "MX",
                addressLocality: "Mazatl\u00e1n",
                addressRegion: "Sinaloa",
              },
              sameAs: [
                "https://www.instagram.com/ollinagency/",
                "https://x.com/OLLINAGENCY",
                "https://www.facebook.com/ollin.agency",
                "https://www.threads.com/@ollinagency",
                "https://www.linkedin.com/company/ollinagency/",
              ],
              knowsLanguage: ["en", "es"],
            }}
          />
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "OLLIN Agency",
              url: "https://ollin.agency",
            }}
          />
          <Navbar />
          <main className="w-full min-h-screen bg-ollin-bg text-ollin-black relative selection:bg-black selection:text-white">
            {children}
          </main>
          <ConditionalOutro />
        </LeadModalProvider>
      </body>
    </html>
  );
}
