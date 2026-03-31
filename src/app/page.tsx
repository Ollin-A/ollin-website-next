import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ReelPeekSection from "@/components/home/ReelPeekSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import BookingSystemSection from "@/components/home/BookingSystemSection";
import ApproachSection from "@/components/home/ApproachSection";
import PricingSection from "@/components/home/PricingSection";
import Faq from "@/components/home/Faq";

export const metadata: Metadata = {
  title: "OLLIN \u2014 Design & Systems for Contractors",
  description:
    "More calls and estimates for contractors \u2014 turned into booked jobs with websites, ads, Google Maps, faster replies, and automatic follow-ups.",
  alternates: { canonical: "https://ollin.agency/" },
  openGraph: {
    title: "OLLIN \u2014 Design & Systems for Contractors",
    description:
      "More calls and estimates for contractors \u2014 turned into booked jobs with websites, ads, Google Maps, faster replies, and automatic follow-ups.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "OLLIN \u2014 Design & Systems for Contractors",
    description:
      "More calls and estimates for contractors \u2014 turned into booked jobs with websites, ads, Google Maps, faster replies, and automatic follow-ups.",
  },
};

export default function HomePage() {
  return (
    <div className="bg-[#F2F2F2]">
      <div className="overflow-x-clip">
        <Hero />
        <ReelPeekSection />
        <ServicesPreview />
        <BookingSystemSection />
        <ApproachSection />
        <PricingSection />
        <Faq />
      </div>
    </div>
  );
}
