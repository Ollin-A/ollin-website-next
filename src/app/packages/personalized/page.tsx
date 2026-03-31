import type { Metadata } from "next";
import PersonalizedPackageClient from "@/components/packages/personalized/PersonalizedPackageClient";

export const metadata: Metadata = {
  title: "Build Your Plan",
  description:
    "Build a custom contractor marketing plan. Select the services you need and request a personalized scope.",
  alternates: { canonical: "/packages/personalized" },
  openGraph: {
    title: "Build Your Plan — OLLIN",
    description:
      "Build a custom contractor marketing plan. Select the services you need and request a personalized scope.",
    url: "/packages/personalized",
  },
  twitter: {
    card: "summary",
    title: "Build Your Plan",
    description:
      "Build a custom contractor marketing plan. Select the services you need and request a personalized scope.",
  },
};

export default function PersonalizedPackagePage() {
  return <PersonalizedPackageClient />;
}
