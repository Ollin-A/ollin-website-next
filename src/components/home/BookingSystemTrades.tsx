"use client";

import React, { useState } from "react";
import { useLeadModal } from "@/components/lead/LeadModalProvider";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import LiquidImage from "@/components/effects/LiquidImage";

type Trade = {
  name: string;
  headline: string;
  sub: string;
  img: string;
};

const trades: Trade[] = [
  {
    name: "Roofing",
    headline: "Win the urgent calls.",
    sub: "Storm season visibility + fast follow-ups.",
    img: "/media/images/trade-roofing.jpeg",
  },
  {
    name: "Plumbing",
    headline: "Be the first they call.",
    sub: "Maps + quick replies for high-intent jobs.",
    img: "/media/images/trade-plumbing.jpeg",
  },
  {
    name: "HVAC",
    headline: "Stay booked all year.",
    sub: "Seasonal demand + consistent lead flow.",
    img: "/media/images/trade-hvac.jpeg",
  },
  {
    name: "Electrical",
    headline: "Cleaner leads, better jobs.",
    sub: "Target the right service calls in your area.",
    img: "/media/images/trade-electrical.jpeg",
  },
  {
    name: "Remodeling",
    headline: "Premium positioning.",
    sub: "Before/after proof that sells bigger projects.",
    img: "/media/images/trade-remodeling.jpeg",
  },
  {
    name: "Concrete",
    headline: "Own your service radius.",
    sub: "Local visibility + estimate requests that convert.",
    img: "/media/images/trade-concrete.jpeg",
  },
  {
    name: "Landscaping",
    headline: "Consistent weekly inquiries.",
    sub: "Keep the phone ringing beyond peak season.",
    img: "/media/images/trade-landscaping.jpeg",
  },
  {
    name: "Painting",
    headline: "Look pro online.",
    sub: "Photos + simple pages that drive estimates.",
    img: "/media/images/trade-painting.jpeg",
  },
  {
    name: "Cleaning",
    headline: "More recurring clients.",
    sub: "Simple booking flow + follow-ups that stick.",
    img: "/media/images/trade-cleaning.jpeg",
  },
  {
    name: "Restoration",
    headline: "High-intent emergencies.",
    sub: "Be visible when they need you now.",
    img: "/media/images/trade-restoration.jpeg",
  },
  {
    name: "Fencing",
    headline: "Better projects, fewer tire-kickers.",
    sub: "Targeted leads + proof that builds trust.",
    img: "/media/images/trade-fencing.jpeg",
  },
  {
    name: "General Contractors",
    headline: "A full pipeline, installed.",
    sub: "Visibility \u2192 calls \u2192 estimates \u2192 booked work.",
    img: "/media/images/trade-general-contractors.jpeg",
  },
  {
    name: "Mold Remediation",
    headline: "Own the urgent fixes.",
    sub: "Be visible when water shows up fast.",
    img: "/media/images/trade-mold-remediation.jpeg",
  },
  {
    name: "Waterproofing",
    headline: "Protect the home, win the job.",
    sub: "High-intent leads + faster booking.",
    img: "/media/images/trade-waterproofing.jpeg",
  },
  {
    name: "Siding",
    headline: "Look sharp from the street.",
    sub: "Local visibility + proof that builds trust.",
    img: "/media/images/trade-siding.jpeg",
  },
  {
    name: "And many more...",
    headline: "Full-service marketing, built for contractors.",
    sub: "Ads, websites, and social that looks premium and brings booked work.",
    img: "/media/images/trade-more.jpeg",
  },
];

const BookingSystemTrades: React.FC = () => {
  const { openModal } = useLeadModal();
  const { isLowPower, supportsWebGL } = useDeviceCapability();

  const [activeTradeIdx, setActiveTradeIdx] = useState(0);
  const activeTrade = trades[activeTradeIdx];

  const mobileTradePicker = (
      <div className="mt-14 md:mt-16 lg:hidden">
        <div className="text-xs font-semibold tracking-[0.18em] uppercase text-ollin-black/45">
          Built for your trade
        </div>
        <p className="mt-3 text-base md:text-lg leading-snug text-ollin-black/70 max-w-[520px]">
          Same system. Different trade. Same goal: more calls and more booked
          jobs.
        </p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
          {trades.map((t, idx) => {
            const active = idx === activeTradeIdx;
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => setActiveTradeIdx(idx)}
                aria-pressed={active}
                className={[
                  "justify-self-start self-start",
                  "inline-flex w-fit",
                  "text-left",
                  "text-[15px] md:text-[16px]",
                  "tracking-tight",
                  "transition-colors duration-150",
                  "py-2 -my-1",
                  "outline-none focus-visible:ring-2 focus-visible:ring-black/15 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2F2F2]",
                  active
                    ? "text-ollin-black"
                    : "text-ollin-black/55 hover:text-ollin-black/80",
                ].join(" ")}
              >
                {t.name}
              </button>
            );
          })}
        </div>

        <div className="mt-8 relative">
          <div className="relative overflow-visible rounded-none bg-transparent">
            <div className="relative z-0 w-full bg-ollin-bg overflow-hidden aspect-16/10 sm:aspect-video">
              <img
                src={activeTrade.img}
                alt={activeTrade.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(242,239,233,0.85), rgba(242,239,233,0.18), rgba(242,239,233,0.0))",
                }}
              />
            </div>

            <div className="relative z-20 bg-white px-6 md:px-8 py-6 md:py-7">
              <div className="text-xs font-semibold tracking-[0.18em] uppercase text-ollin-black/45">
                {activeTrade.name}
              </div>
              <div className="mt-2 text-2xl md:text-3xl font-medium tracking-tight leading-[1.05]">
                {activeTrade.headline}
              </div>
              <div className="mt-2 text-sm md:text-base text-ollin-black/70 max-w-[560px]">
                {activeTrade.sub}
              </div>

              <SecondaryButton
                onClick={openModal}
                label="Talk to us"
                className="mt-6 text-sm font-semibold tracking-tight"
              />
            </div>
          </div>
        </div>
      </div>
  );

  return (
    <>
      {mobileTradePicker}

      <div className="mt-14 md:mt-16 hidden lg:grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
        <div>
          <div className="text-xs font-semibold tracking-[0.18em] uppercase text-ollin-black/45">
            Built for your trade
          </div>
          <p className="mt-3 text-base md:text-lg leading-snug text-ollin-black/70 max-w-[520px]">
            Same system. Different trade. Same goal: more calls and more booked
            jobs.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 justify-items-start items-start">
            {trades.map((t, idx) => {
              const active = idx === activeTradeIdx;
              return (
                <button
                  key={t.name}
                  onMouseEnter={() => setActiveTradeIdx(idx)}
                  onFocus={() => setActiveTradeIdx(idx)}
                  className={[
                    "justify-self-start self-start",
                    "inline-flex w-fit",
                    "text-left",
                    "text-sm md:text-[15px]",
                    "tracking-tight",
                    "transition-colors duration-150",
                    active
                      ? "text-ollin-black"
                      : "text-ollin-black/55 hover:text-ollin-black/80",
                    "outline-none",
                  ].join(" ")}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-visible rounded-none bg-transparent">
            <div className="relative z-0 h-[260px] sm:h-[300px] md:h-[340px] bg-ollin-bg overflow-visible">
              {!isLowPower && supportsWebGL ? (
                <LiquidImage
                  key={activeTrade.img}
                  src={activeTrade.img}
                  alt={activeTrade.name}
                  className="absolute inset-0 h-full w-full"
                  overscan={22}
                />
              ) : (
                <img
                  key={activeTrade.img}
                  src={activeTrade.img}
                  alt={activeTrade.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(242,239,233,0.85), rgba(242,239,233,0.18), rgba(242,239,233,0.0))",
                }}
              />
            </div>

            <div className="relative z-20 bg-white px-6 md:px-8 py-6 md:py-7">
              <div className="text-xs font-semibold tracking-[0.18em] uppercase text-ollin-black/45">
                {activeTrade.name}
              </div>
              <div className="mt-2 text-2xl md:text-3xl font-medium tracking-tight leading-[1.05]">
                {activeTrade.headline}
              </div>
              <div className="mt-2 text-sm md:text-base text-ollin-black/70 max-w-[560px]">
                {activeTrade.sub}
              </div>

              <SecondaryButton
                onClick={openModal}
                label="Talk to us"
                className="mt-6 text-sm font-semibold tracking-tight"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingSystemTrades;
