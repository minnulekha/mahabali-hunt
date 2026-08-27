"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null); 
  
  // States: 'idle' (waiting for click) -> 'playing' (video running) -> 'finished' (hero UI shown)
  const [introState, setIntroState] = useState<"idle" | "playing" | "finished">("idle");
  const [isMuted, setIsMuted] = useState(false);

  // --- START INTRO LOGIC ---
  const handleStartIntro = () => {
    setIntroState("playing");
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
    
    if (audioRef.current) {
      audioRef.current.volume = 0.6;
      audioRef.current.play().catch(() => setIsMuted(true));
    }
  };

  // --- SKIP INTRO LOGIC ---
  const handleSkipIntro = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = videoRef.current.duration || 10; 
    }
    setIntroState("finished");
  };

  // --- VIDEO ENDED LOGIC ---
  const handleVideoEnded = () => {
    setIntroState("finished");
  };

  // --- TOGGLE SOUND LOGIC ---
  const toggleSound = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden">
      
      <audio ref={audioRef} src="/bg-music.mp3" loop />

      {/* --- CINEMATIC VIDEO BACKGROUND --- */}
      <video 
        ref={videoRef}
        src="/hero.mp4" 
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted 
        onEnded={handleVideoEnded}
      />
      
      {/* Pure Black Overlay for readability when UI is visible */}
      <div className={`absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90 pointer-events-none transition-opacity duration-1000 ${introState === 'finished' ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Navbar (Only show when finished) */}
      <div className={`relative z-50 transition-opacity duration-1000 ${introState === 'finished' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Navbar />
      </div>

      {/* ========================================= */}
      {/* STATE 1: IDLE (WAITING TO START)          */}
      {/* ========================================= */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center z-40 transition-opacity duration-500 bg-black/60 backdrop-blur-sm ${introState === 'idle' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col items-center animate-float" style={{ animationDuration: '4s' }}>
          
          <div className="mb-8 relative flex items-center justify-center">
            <div className="absolute w-24 h-24 md:w-32 md:h-32 bg-[#D4AF37]/20 rounded-full blur-xl animate-pulse"></div>
            <button 
              onClick={handleStartIntro}
              className="relative w-16 h-16 md:w-20 md:h-20 border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] hover:scale-110 transition-all duration-300 group"
            >
              <svg className="w-8 h-8 md:w-10 md:h-10 text-[#D4AF37] ml-1 group-hover:text-[#FFF0B3] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>

          <h2 className="font-[family-name:var(--font-cinzel-decorative)] text-2xl md:text-4xl text-[#D4AF37] tracking-widest drop-shadow-lg mb-3">
            ENTER THE REALM
          </h2>
          <p className="font-sans text-[10px] md:text-xs text-[#FDFBF7]/60 tracking-[0.3em] uppercase">
            Click to uncover the legend
          </p>

        </div>
      </div>

      {/* ========================================= */}
      {/* STATE 2: PLAYING (VIDEO IS RUNNING)       */}
      {/* ========================================= */}
      <div 
        className={`absolute bottom-8 right-8 z-40 transition-opacity duration-500 ${introState === 'playing' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <button 
          onClick={handleSkipIntro}
          className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-[#D4AF37] border border-white/20 hover:border-[#D4AF37] px-4 py-2 bg-black/50 backdrop-blur-md rounded transition-all"
        >
          Skip Intro ⏭
        </button>
      </div>

      {/* ========================================= */}
      {/* STATE 3: FINISHED (HERO UI VISIBLE)       */}
      {/* ========================================= */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-1000 ${introState === 'finished' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <div className="flex flex-col items-center z-10 mt-16 md:mt-24 animate-fade-in w-full max-w-5xl">
          
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-2 md:mb-3 text-[#F3E5AB]">
            <span className="text-xs md:text-sm">✧</span>
            <span className="font-sans text-[9px] sm:text-[11px] md:text-sm tracking-[0.3em] font-medium uppercase drop-shadow-md">
              This Onam, Let&apos;s Find Our King
            </span>
            <span className="text-xs md:text-sm">✧</span>
          </div>

          {/* THE MAHABALI TITLE WITH THE FLOAT ANIMATION */}
          <h1 
            className="font-[family-name:var(--font-cinzel-decorative)] text-6xl sm:text-8xl md:text-[110px] lg:text-[140px] leading-none tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#D4AF37] to-[#8C6216] mb-2 font-bold w-full animate-float" 
            style={{ filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.9))", animationDuration: '6s' }}
          >
            MAHABALI
          </h1>

          <div className="flex items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8 w-full">
             <div className="h-[1px] w-8 sm:w-12 md:w-32 bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
             <h2 className="font-serif text-sm sm:text-lg md:text-2xl text-[#FDFBF7] tracking-[0.15em] sm:tracking-[0.25em] drop-shadow-lg whitespace-nowrap">
               LOST ON THE OPEN WEB
             </h2>
             <div className="h-[1px] w-8 sm:w-12 md:w-32 bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
          </div>

          <p className="font-sans text-[8px] sm:text-[10px] md:text-xs text-[#FDFBF7]/80 tracking-[0.1em] sm:tracking-[0.2em] uppercase mb-10 md:mb-12 drop-shadow-md">
            Find the trail. Solve the clues. Find Mahabali.
          </p>

          {/* --- THE TWO BUTTON LAYOUT --- */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-none">
            
            <Link href="/game" className="group w-full sm:w-auto p-[2px] clip-game-button bg-gradient-to-b from-[#FFF0B3] to-[#8C6216] shadow-[0_0_40px_rgba(212,175,55,0.4)] animate-heartbeat btn-hover-effect transition-all duration-200 ease-out">
              <div className="clip-game-button bg-premium-gold px-8 sm:px-10 md:px-12 py-3.5 flex items-center justify-center gap-3 w-full">
                <span className="font-sans font-extrabold tracking-widest text-[11px] md:text-[13px] uppercase text-[#2B1B04] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                  Start The Hunt
                </span>
                <svg className="w-4 h-4 text-[#2B1B04] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </div>
            </Link>
            
            <Link href="/how-to-play" className="group w-full sm:w-auto p-[2px] clip-game-button bg-gradient-to-b from-[#D4AF37] to-[#7A5C13] shadow-[0_0_20px_rgba(0,0,0,0.5)] animate-heartbeat btn-hover-effect transition-all duration-200 ease-out" style={{ animationDelay: '0.2s' }}>
              <div className="clip-game-button bg-premium-glass px-8 sm:px-10 md:px-12 py-3.5 flex items-center justify-center gap-3 w-full">
                <span className="font-sans font-bold tracking-widest text-[11px] md:text-[13px] uppercase text-[#FDFBF7] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  How to Play
                </span>
                <span className="border-2 border-[#D4AF37] rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[9px] md:text-[10px] font-bold text-[#D4AF37] shadow-[0_0_5px_rgba(212,175,55,0.5)]">?</span>
              </div>
            </Link>

          </div>

        </div>
      </div>

      {/* --- SOUND TOGGLE BUTTON (Visible During and After Video) --- */}
      <button 
        onClick={toggleSound}
        className={`absolute bottom-6 left-6 md:bottom-8 md:left-8 z-50 group flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-2 rounded-full bg-black/40 backdrop-blur-md border border-[#D4AF37]/40 hover:bg-black/60 hover:border-[#D4AF37] transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] pointer-events-auto ${introState === 'idle' ? 'hidden' : 'flex'}`}
      >
        <span className="font-sans text-[9px] md:text-[10px] tracking-widest uppercase text-[#FDFBF7] opacity-80 group-hover:opacity-100 transition-opacity">
          {isMuted ? "Sound Off" : "Sound On"}
        </span>
        <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
          {isMuted ? (
            <svg className="w-3 h-3 md:w-4 md:h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-3 h-3 md:w-4 md:h-4 text-[#D4AF37] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </div>
      </button>

    </div>
  );
}