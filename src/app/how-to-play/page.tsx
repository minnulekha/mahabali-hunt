"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function HowToPlay() {
  const steps = [
    {
      number: "01",
      title: "Generate Your Passcode",
      desc: "Register your team on this website before the hunt begins to generate your unique 6-digit Secret Passcode. Save it securely—you cannot enter the game terminal without it.",
      icon: (
        <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      )
    },
    {
      number: "02",
      title: "Access Terminal at 7:30 PM",
      desc: "The terminal unlocks at exactly 7:30 PM IST. Enter your 6-digit passcode to initialize your session, reveal your first parchment clue, and start the timer.",
      icon: (
        <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    {
      number: "03",
      title: "Investigate Open Web Resources",
      desc: "Click the 'Investigate the Web' button on each parchment to follow live external clues across Stellarium, OpenStreetMap, Wikimedia Commons, and digital archives.",
      icon: (
        <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
        </svg>
      )
    },
    {
      number: "04",
      title: "Scoring & Hint Restrictions",
      desc: "Solving a clue without assistance earns 100 points. You are allowed a maximum of 3 hints for the entire hunt; each hint used deducts 50 points (yielding 50 points on solve).",
      icon: (
        <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.493 1.508 1.333 1.508 2.316V18" />
        </svg>
      )
    },
    {
      number: "05",
      title: "Journey Through 5 Stages",
      desc: "After each correct key, review your route on the animated progress map before traveling to the next stage. The fastest team with the highest score at 8:30 PM wins!",
      icon: (
        <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
        </svg>
      )
    }
  ];

  return (
    <main className="min-h-screen bg-[#0D2B1D] bg-[url('/BG.png')] bg-cover bg-center bg-fixed text-[#FDFBF7]">
      {/* Ambient Dark Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0D2B1D]/80 via-black/60 to-[#0D2B1D]/90 z-0"></div>

      <div className="relative z-50">
        <Navbar />
      </div>

      <section className="relative z-10 pt-40 pb-32 px-6 md:px-12 max-w-5xl mx-auto">
        {/* Header Title */}
        <div className="text-center mb-20 animate-float" style={{ animationDuration: '4s' }}>
          <div className="flex items-center justify-center gap-4 mb-4 text-[#F3E5AB]">
            <span className="text-sm">✧</span>
            <span className="font-sans text-[11px] tracking-[0.3em] font-bold uppercase drop-shadow-md">The Rules of the Hunt</span>
            <span className="text-sm">✧</span>
          </div>
          <h1 className="font-[family-name:var(--font-cinzel-decorative)] text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#D4AF37] to-[#8C6216] font-bold mb-6 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
            How to Play
          </h1>
          <p className="font-sans text-sm md:text-lg text-[#FDFBF7]/90 max-w-2xl mx-auto tracking-widest drop-shadow-md">
            Solve the 5 open-web clues. Chart your journey. Reclaim the King.
          </p>
        </div>

        {/* Steps Glass Panels */}
        <div className="space-y-8 md:space-y-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0D2B1D]/90 to-black/90 backdrop-blur-xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-500 p-8 md:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            >
              {/* Background Watermark Number */}
              <div className="absolute -bottom-12 -right-8 text-[150px] md:text-[200px] leading-none font-serif font-bold text-[#D4AF37] opacity-5 group-hover:opacity-15 transition-opacity duration-700 pointer-events-none select-none">
                {step.number}
              </div>
              
              {/* Glow Behind Icon */}
              <div className="absolute top-1/2 left-12 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl transform -translate-y-1/2 group-hover:bg-[#D4AF37]/20 transition-all duration-500 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                {/* Icon Container */}
                <div className="shrink-0 w-24 h-24 rounded-full bg-gradient-to-br from-[#FFF0B3] via-[#D4AF37] to-[#8C6216] p-[2px] shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-shadow duration-500">
                  <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-md flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="text-center md:text-left pt-2">
                  <h3 className="font-[family-name:var(--font-cinzel-decorative)] text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] to-[#D4AF37] mb-4 font-bold drop-shadow-md">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[#FDFBF7]/70 text-sm md:text-base tracking-widest leading-loose max-w-2xl">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-24 flex flex-col sm:flex-row justify-center items-center gap-6 relative z-20">
          <Link href="/about" className="group relative p-[2px] clip-game-button bg-gradient-to-b from-[#D4AF37] to-[#7A5C13] shadow-[0_0_20px_rgba(0,0,0,0.5)] btn-hover-effect transition-all duration-200">
            <div className="clip-game-button bg-premium-glass px-12 py-5 flex items-center gap-3">
              <span className="font-sans font-bold tracking-widest text-[13px] uppercase text-[#FDFBF7] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Register Team
              </span>
            </div>
          </Link>

          <Link href="/game" className="group relative p-[2px] clip-game-button bg-gradient-to-b from-[#FFF0B3] to-[#8C6216] shadow-[0_0_40px_rgba(212,175,55,0.4)] animate-heartbeat btn-hover-effect transition-all duration-200">
            <div className="clip-game-button bg-premium-gold px-16 py-5 flex items-center gap-3">
              <span className="font-sans font-extrabold tracking-widest text-[15px] uppercase text-[#2B1B04] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                Start The Hunt
              </span>
              <svg className="w-5 h-5 text-[#2B1B04] group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}