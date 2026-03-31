"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { SingleService } from "@/types/packages";
import { PALETTE, LINE } from "@/lib/constants/packages";
import { cn } from "@/lib/utils";
import SecondaryButton from "@/components/ui/SecondaryButton";

type Props = {
  services: SingleService[];
  onRequestScope: (serviceId: string) => void;
};

type MenuItem = {
  key: string;
  serviceId: string;
  label: string;
  hint?: string;
};

const CORE_ITEMS: Array<{ id: string; label: string }> = [
  { id: "website", label: "Website build" },
  { id: "site-tune", label: "Website tune-up" },
  { id: "logo", label: "Logo cleanup" },
  { id: "social", label: "Social setup" },
  { id: "gbp", label: "GBP setup + cleanup" },
  { id: "reviews", label: "Review engine" },
  { id: "ads", label: "Ads management" },
  { id: "tracking", label: "Tracking + ROI" },
];

const EXTRA_ITEMS: string[] = [
  "360° Revenue Leak Audit",
  "Call review (30–50)",
  "Website audit (speed + SEO)",
  "Conversion audit (forms + offer)",
  "90-Day plan (PDF)",
  "Quick-wins sprint",

  "Landing page (long-form)",
  "Full website (5 pages)",
  "Multi-city website",
  "Bilingual EN/ES",
  "Website care (hosting + updates)",

  "Mini brand guide",
  "Brand templates (truck/uniform)",

  "Google Ads setup",
  "Meta Ads setup",
  "CRM pipeline setup",
  "NAP + citations cleanup",
  "Reviews flow (SMS/WhatsApp)",
  "Lead capture + booking",
  "Monthly content plan",

  "",
];

export default function SingleServicesSection({
  services,
  onRequestScope,
}: Props) {
  const router = useRouter();

  const menuItems: MenuItem[] = useMemo(() => {
    const byId = new Map(services.map((s) => [s.id, s] as const));

    const core: MenuItem[] = CORE_ITEMS.map((c) => {
      const s = byId.get(c.id);
      return {
        key: `core-${c.id}`,
        serviceId: c.id,
        label: c.label,
        hint:
          s?.hint ??
          "We'll reply with a clean scope (what's included + timeline).",
      };
    });

    const extras: MenuItem[] = EXTRA_ITEMS.map((label, i) => ({
      key: `extra-${i}`,
      serviceId: "custom",
      label,
      hint: "We'll reply with a clean scope (what's included + timeline).",
    }));

    return [...core, ...extras];
  }, [services]);

  const openWithItem = (item: MenuItem) => {
    onRequestScope(item.serviceId);
  };

  const openCustomBlank = () => {
    onRequestScope("custom");
  };

  if (!menuItems.length) return null;

  return (
    <section className="mt-16">
      <div
        className="text-[11px] uppercase tracking-[0.28em]"
        style={{ color: "rgba(0,0,0,0.45)" }}
      >
        Single services
      </div>

      <div className="mt-2 max-w-3xl">
        <h2 className="font-[Montserrat] font-medium text-2xl md:text-3xl leading-tight">
          Pick one. We&apos;ll scope it cleanly.
        </h2>
        <p
          className="mt-1 text-sm md:text-base leading-relaxed"
          style={{ color: PALETTE.muted }}
        >
          Click a service to request scope — quick, clear, no fluff.
        </p>
      </div>

      <div className="mt-6">
        <div
          className="border-t"
          style={{ borderColor: LINE, opacity: 0.7 }}
        />

        <div className="pt-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-3">
          {menuItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => openWithItem(item)}
              className={cn(
                "text-left w-full",
                "transition-opacity duration-200"
              )}
              style={{
                fontFamily:
                  "Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: 1.35,
                color: "rgba(0,0,0,0.52)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(0,0,0,0.70)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(0,0,0,0.52)";
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span style={{ color: PALETTE.muted }}>
            Not seeing what you need?
          </span>

          <SecondaryButton onClick={openCustomBlank} label="Contact us" />

          <span style={{ color: "rgba(0,0,0,0.35)" }}>or</span>

          <SecondaryButton
            onClick={() => router.push("/services")}
            label="Browse all services"
          />
        </div>
      </div>
    </section>
  );
}
