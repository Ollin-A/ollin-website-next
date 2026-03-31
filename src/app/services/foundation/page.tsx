import type { Metadata } from "next";
import FoundationContent from "@/components/services/FoundationContent";

export const metadata: Metadata = {
  title: "Foundation",
  description: "Brand, website, and social presence that builds trust and converts the first visit into the first call. For U.S. contractors.",
  alternates: { canonical: "/services/foundation" },
  openGraph: {
    title: "Foundation",
    description:
      "Brand, website, and social presence that builds trust and converts the first visit into the first call. For U.S. contractors.",
    url: "/services/foundation",
  },
  twitter: {
    card: "summary",
    title: "Foundation",
    description:
      "Brand, website, and social presence that builds trust and converts the first visit into the first call. For U.S. contractors.",
  },
};

export default function FoundationPage() {
  return <FoundationContent />;
}
