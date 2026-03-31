import type { Metadata } from "next";
import ThankYouContent from "@/components/thank-you/ThankYouContent";

export const metadata: Metadata = {
  title: "Thank You",
  description:
    "Your request has been received. We will be in touch within 24 hours.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/thank-you" },
};

export default function ThankYouPage() {
  return <ThankYouContent />;
}
