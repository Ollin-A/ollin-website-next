"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PackageTier } from "@/types/packages";
import { PALETTE } from "@/lib/constants/packages";
import { PACKAGES, SINGLE_SERVICES, COMPARISON } from "@/lib/data/packages";
import { useLeadModal } from "@/components/lead/LeadModalProvider";

import PackagesHero from "./PackagesHero";
import PackagesHeroMobile from "./PackagesHeroMobile";
import PackagesGrid from "./PackagesGrid";
import PackagesGridMobile from "./PackagesGridMobile";
import PackageDetailSheet from "./PackageDetailSheet";
import SingleServicesSection from "./SingleServicesSection";
import SingleServicesSectionMobile from "./SingleServicesSectionMobile";
import ComparisonSection from "./ComparisonSection";
import ComparisonSectionMobile from "./ComparisonSectionMobile";
import CustomPlanCTASection from "./CustomPlanCTASection";

export default function PackagesClient() {
  const router = useRouter();
  const { openModal } = useLeadModal();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [panelPkg, setPanelPkg] = useState<PackageTier>(() => PACKAGES[0]);

  const panelOuterRef = useRef<HTMLDivElement | null>(null);

  const togglePackage = (id: string) => {
    setActiveId((prev) => {
      const next = prev === id ? null : id;
      if (next) {
        const nextPkg = PACKAGES.find((p) => p.id === next);
        if (nextPkg) setPanelPkg(nextPkg);
      }
      return next;
    });

    requestAnimationFrame(() => {
      const willOpen = activeId !== id;
      if (willOpen)
        panelOuterRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  };

  const anySelected = !!activeId;

  const handleBuildYourOwnPlan = () => {
    router.push("/packages/personalized");
  };

  return (
    <div
      className="w-full"
      style={{ background: PALETTE.bg, color: PALETTE.ink }}
    >
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-20 font-[Poppins]">
        <div className="hidden md:block">
          <PackagesHero muted={PALETTE.muted} />
        </div>
        <div className="md:hidden">
          <PackagesHeroMobile muted={PALETTE.muted} />
        </div>

        <div className="hidden md:block">
          <PackagesGrid
            packages={PACKAGES}
            activeId={activeId}
            anySelected={anySelected}
            onSelect={togglePackage}
          />
        </div>
        <div className="md:hidden">
          <PackagesGridMobile packages={PACKAGES} onSelect={togglePackage} />
        </div>

        <PackageDetailSheet
          outerRef={panelOuterRef}
          activeId={activeId}
          panelPkg={panelPkg}
          onRequestScope={() => openModal()}
          onBuildYourOwnPlan={handleBuildYourOwnPlan}
        />

        <div className="hidden md:block">
          <ComparisonSection
            packages={PACKAGES}
            rows={COMPARISON}
            activeId={activeId}
            onSelect={togglePackage}
          />
        </div>
        <div className="md:hidden">
          <ComparisonSectionMobile packages={PACKAGES} rows={COMPARISON} />
        </div>

        <div className="hidden md:block">
          <SingleServicesSection
            services={SINGLE_SERVICES}
            onRequestScope={() => openModal()}
          />
        </div>
        <div className="md:hidden">
          <SingleServicesSectionMobile
            services={SINGLE_SERVICES}
            onRequestScope={() => openModal()}
          />
        </div>

        <CustomPlanCTASection onBuildYourOwnPlan={handleBuildYourOwnPlan} />
      </div>
    </div>
  );
}
