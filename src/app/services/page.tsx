import type { Metadata } from "next";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesChapters from "@/components/services/ServicesChapters";

export const metadata: Metadata = {
  title: "Services & Systems",
  description: "Three systems to grow your contracting business: Foundation (brand + website), Demand (ads + Maps), and Retention (follow-ups + reviews).",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services & Systems",
    description:
      "Three systems to grow your contracting business: Foundation (brand + website), Demand (ads + Maps), and Retention (follow-ups + reviews).",
    url: "/services",
  },
  twitter: {
    card: "summary",
    title: "Services & Systems",
    description:
      "Three systems to grow your contracting business: Foundation (brand + website), Demand (ads + Maps), and Retention (follow-ups + reviews).",
  },
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesChapters />
    </>
  );
}
