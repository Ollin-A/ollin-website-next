import type { Metadata } from "next";
import StructuredData from "@/components/ui/StructuredData";
import AuditContent from "@/components/services/AuditContent";

export const metadata: Metadata = {
  title: "360° Revenue Leak Audit",
  description: "Find where calls, leads, and margin are leaking — then get a clear priority plan to fix it. For U.S. contractors.",
  alternates: { canonical: "/services/audit" },
  openGraph: {
    title: "360\u00B0 Revenue Leak Audit",
    description:
      "Find where calls, leads, and margin are leaking — then get a clear priority plan to fix it. For U.S. contractors.",
    url: "/services/audit",
  },
  twitter: {
    card: "summary",
    title: "360\u00B0 Revenue Leak Audit",
    description:
      "Find where calls, leads, and margin are leaking — then get a clear priority plan to fix it. For U.S. contractors.",
  },
};

export default function AuditPage() {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Contractor Marketing - Audit",
          provider: {
            "@type": "Organization",
            name: "OLLIN Agency",
            url: "https://ollin.agency",
          },
          areaServed: { "@type": "Country", name: "United States" },
          availableLanguage: ["English", "Spanish"],
          description:
            "Find what's leaking revenue—then fix the order of operations.",
        }}
      />
      <AuditContent />
    </>
  );
}
