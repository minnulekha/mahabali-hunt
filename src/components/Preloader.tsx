"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Preloader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 1. Reset preloader state on every route change
    setIsVisible(true);
    setIsFading(false);

    let minTimeElapsed = false;
    let isLoaded = document.readyState === "complete";

    const finishLoading = () => {
      // Only fade out if the cinematic minimum time has passed AND the browser says assets are loaded
      if (minTimeElapsed && isLoaded) {
        setIsFading(true);
        setTimeout(() => setIsVisible(false), 800);
      }
    };

    // Enforce a minimum 1.5-second cinematic loading screen
    const minTimer = setTimeout(() => {
      minTimeElapsed = true;
      finishLoading();
    }, 1500);

    // Listen for the browser to finish loading heavy assets
    const handleLoad = () => {
      isLoaded = true;
      finishLoading();
    };

    if (!isLoaded) {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearTimeout(minTimer);
      window.removeEventListener("load", handleLoad);
    };
  }, [pathname]); // The pathname dependency ensures this runs on every page click

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05130D] transition-opacity duration-700 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Cinematic Ambient Background */}
      <div className="absolute inset-0 bg-[url('/BG.png')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none"></div>

      {/* Rotating Gold Ring */}
      <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 mb-8">
        <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-[#D4AF37] animate-spin shadow-[0_0_30px_rgba(212,175,55,0.3)]"></div>
        <div className="absolute inset-2 rounded-full border-l-2 border-r-2 border-[#FFF0B3]/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        {/* Center Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse shadow-[0_0_10px_#D4AF37]"></div>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <span className="font-[family-name:var(--font-cinzel-decorative)] text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0B3] via-[#D4AF37] to-[#8C6216] font-bold tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
          MAHABALI
        </span>
        <div className="flex items-center gap-3">
          <div className="w-6 h-[1px] bg-[#D4AF37]/50"></div>
          <span className="font-sans text-[8px] md:text-[10px] text-[#FDFBF7]/60 tracking-[0.4em] uppercase animate-pulse">
            Decrypting Assets...
          </span>
          <div className="w-6 h-[1px] bg-[#D4AF37]/50"></div>
        </div>
      </div>
    </div>
  );
}