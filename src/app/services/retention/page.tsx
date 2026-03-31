import type { Metadata } from "next";
import RetentionContent from "@/components/services/RetentionContent";

export const metadata: Metadata = {
  title: "Retention",
  description: "Real-time lead handling, reviews, and reactivation — so jobs turn into 5-stars, referrals, and repeat work. For U.S. contractors.",
  alternates: { canonical: "/services/retention" },
  openGraph: {
    title: "Retention",
    description:
      "Real-time lead handling, reviews, and reactivation — so jobs turn into 5-stars, referrals, and repeat work. For U.S. contractors.",
    url: "/services/retention",
  },
  twitter: {
    card: "summary",
    title: "Retention",
    description:
      "Real-time lead handling, reviews, and reactivation — so jobs turn into 5-stars, referrals, and repeat work. For U.S. contractors.",
  },
};

export default function RetentionPage() {
  return <RetentionContent />;
}
