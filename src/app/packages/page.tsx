import type { Metadata } from "next";
import PackagesClient from "@/components/packages/PackagesClient";

export const metadata: Metadata = {
  title: "Packages & Plans",
  description:
    "Pick your starting point. Modular packages for contractor marketing — from basic presence to full growth systems.",
  alternates: { canonical: "/packages" },
  openGraph: {
    title: "Packages & Plans — OLLIN",
    description:
      "Pick your starting point. Modular packages for contractor marketing — from basic presence to full growth systems.",
    url: "/packages",
  },
  twitter: {
    card: "summary",
    title: "Packages & Plans",
    description:
      "Pick your starting point. Modular packages for contractor marketing — from basic presence to full growth systems.",
  },
};

export default function PackagesPage() {
  return <PackagesClient />;
}
