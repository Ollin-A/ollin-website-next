import type { Metadata } from "next";
import DemandContent from "@/components/services/DemandContent";

export const metadata: Metadata = {
  title: "Demand",
  description: "Ads, Google Maps visibility, and tracking that shows what brings real jobs — not vanity metrics. For U.S. contractors.",
  alternates: { canonical: "/services/demand" },
  openGraph: {
    title: "Demand",
    description:
      "Ads, Google Maps visibility, and tracking that shows what brings real jobs — not vanity metrics. For U.S. contractors.",
    url: "/services/demand",
  },
  twitter: {
    card: "summary",
    title: "Demand",
    description:
      "Ads, Google Maps visibility, and tracking that shows what brings real jobs — not vanity metrics. For U.S. contractors.",
  },
};

export default function DemandPage() {
  return <DemandContent />;
}
