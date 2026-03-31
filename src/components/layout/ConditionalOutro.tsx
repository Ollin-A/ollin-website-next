"use client";

import { usePathname } from "next/navigation";
import SiteOutro from "./SiteOutro";

export default function ConditionalOutro() {
  const path = usePathname();
  if (path === "/contact" || path === "/chat") return null;
  return <SiteOutro />;
}
