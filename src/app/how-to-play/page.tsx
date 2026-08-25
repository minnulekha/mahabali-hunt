"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function HowToPlay() {
  const steps = [
    {
      number: "01",
      title: "Generate Your Passcode",
      desc: "Before the hunt begins, register your team on this website. You will be assigned a unique 6-digit Secret Passcode. Save this code securely—it is your only key to enter the game.",
      icon: <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
    },
    {
      number: "02",
      title: "Enter the Terminal at 7:30 PM",
      desc: "The hunt officially begins at 7:30 PM. Once the clock strikes, click 'Start The Hunt' and input your Secret Passcode to access your first clue and start the timer.",
      icon: <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
    },
    {
      number: "03",
      title: "Investigate the Open Web",
      desc: "You will face a series of digital mysteries. Leave the site and investigate open web resources like Wikimedia, OpenStreetMap, or image metadata to uncover the hidden keys.",
      icon: <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10.5 7a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" /></svg>
    },
    {
      number: "04",
      title: "Scoring & Hints",
      desc: "Submit your discovered key to unlock the next level. A correct answer grants 100 points. Stuck? You can request a hint, but it will cost you—clues solved with a hint only award 50 points.",
      icon: <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
    },
    {
      number: "05",
      title: "Top the Leaderboard",
      desc: "Speed and accuracy are everything. The first team to solve all clues with the highest score wins the prize pool. The hunt officially concludes at 8:30 PM!",
      icon: <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
    }
  ];

  return (
    <main className="min-h-screen bg-[#0D2B1D] bg-[url('/BG.png')] bg-cover bg-center bg-fixed text-[#FDFBF7]">
      
      {/* Dynamic ambient overlay to make colors pop */}
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
            Follow the trail of open web clues. Find our King.
          </p>
        </div>

        {/* --- GLOWING GLASS PANELS LAYOUT --- */}
        <div className="space-y-8 md:space-y-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0D2B1D]/90 to-black/90 backdrop-blur-xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-500 p-8 md:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            >
              {/* Massive Watermark Number */}
              <div className="absolute -bottom-12 -right-8 text-[150px] md:text-[200px] leading-none font-serif font-bold text-[#D4AF37] opacity-5 group-hover:opacity-15 transition-opacity duration-700 pointer-events-none select-none">
                {step.number}
              </div>
              
              {/* Ambient Hover Glow behind Icon */}
              <div className="absolute top-1/2 left-12 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl transform -translate-y-1/2 group-hover:bg-[#D4AF37]/20 transition-all duration-500 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                
                {/* Premium Icon Ring */}
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

        {/* Call to Action Buttons */}
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
              <svg className="w-5 h-5 text-[#2B1B04] group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>
          
        </div>

      </section>
    </main>
  );
}