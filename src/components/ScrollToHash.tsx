"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

export function ScrollToHash() {
  const router = useRouter();
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    // Get the hash from the URL
    const hash = window.location.hash;
    if (hash) {
      // Remove the '#' symbol
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        // Routed through Lenis (native smooth scroll fallback when Lenis is off)
        scrollTo(element);
      }
    }
  }, [router, scrollTo]);

  return null;
}
