"use client";
import { useEffect, useRef, useState } from "react";

function hasIntersectionObserver() {
    return typeof IntersectionObserver !== "undefined";
}

export function useRevealOnEnter(threshold = 0.35) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [revealed, setRevealed] = useState(() => !hasIntersectionObserver());

    useEffect(() => {
        if (revealed) return;

        const el = ref.current;
        if (!el) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setRevealed(true);
                    io.disconnect();
                }
            },
            { threshold, rootMargin: "0px 0px -10% 0px" }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [revealed, threshold]);

    return { ref, revealed } as const;
}
