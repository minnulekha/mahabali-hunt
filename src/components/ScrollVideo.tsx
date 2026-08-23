"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null); 
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  
  const [textOpacity, setTextOpacity] = useState(0);
  const [textTranslateY, setTextTranslateY] = useState(20);
  
  // Audio defaults to ON (false means NOT muted)
  const [isMuted, setIsMuted] = useState(false);
  const isAudioPlaying = useRef(false);

  const frameCount = 96; 

  const currentFrame = (index: number) => {
    if (index === frameCount) {
      return `/mahabali_hero_images/end.png`;
    }
    return `/mahabali_hero_images/ezgif-frame-${index.toString().padStart(3, "0")}.jpg`;
  };

  // SMART AUTOPLAY LOGIC
  useEffect(() => {
    const attemptPlay = () => {
      if (audioRef.current && !isAudioPlaying.current) {
        audioRef.current.volume = 0.6; // Not too loud
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // Success! Audio is playing
            setIsMuted(false);
            isAudioPlaying.current = true;
            window.removeEventListener('click', attemptPlay);
            window.removeEventListener('scroll', attemptPlay);
            window.removeEventListener('touchstart', attemptPlay);
          }).catch(() => {
            // Browser blocked it, UI will show "Sound Off" temporarily
            setIsMuted(true);
          });
        }
      }
    };

    // 1. Try to play immediately on load
    attemptPlay();

    // 2. If blocked, play the exact moment the user scrolls or clicks!
    window.addEventListener('click', attemptPlay);
    window.addEventListener('scroll', attemptPlay, { once: true });
    window.addEventListener('touchstart', attemptPlay, { once: true });

    return () => {
      window.removeEventListener('click', attemptPlay);
      window.removeEventListener('scroll', attemptPlay);
      window.removeEventListener('touchstart', attemptPlay);
    };
  }, []);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          if (canvasRef.current) renderFrame(1, loadedImages);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);

    const firstImg = new Image();
    firstImg.src = currentFrame(1);
    firstImg.onload = () => {
      if (canvasRef.current && loadedImages.length < frameCount) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) drawImageCover(ctx, firstImg, canvasRef.current);
      }
    };
  }, []);

  const renderFrame = (frameIndex: number, imgArray = images) => {
    if (!canvasRef.current || imgArray.length === 0) return;
    const ctx = canvasRef.current.getContext("2d");
    const img = imgArray[frameIndex - 1];
    if (ctx && img) {
      drawImageCover(ctx, img, canvasRef.current);
    }
  };

  const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) => {
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    );
  };

  // Scroll mapping
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !canvasRef.current) return;
      
      const scrollTop = window.scrollY;
      const maxScroll = containerRef.current.scrollHeight - window.innerHeight;
      const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
      
      const videoProgress = Math.min(1, scrollFraction / 0.75);
      const frameIndex = Math.min(frameCount - 1, Math.floor(videoProgress * frameCount)) + 1;
      renderFrame(frameIndex);

      if (scrollFraction > 0.65) {
        const progress = Math.min(1, (scrollFraction - 0.65) / 0.15); 
        setTextOpacity(progress);
        setTextTranslateY(20 - (progress * 20)); 
      } else {
        setTextOpacity(0);
        setTextTranslateY(20);
      }
    };

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        handleScroll(); 
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [images]);

  const toggleSound = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
        isAudioPlaying.current = true;
      } else {
        audioRef.current.pause();
        isAudioPlaying.current = false;
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-[#0D2B1D]">
      <audio 
        ref={audioRef} 
        src="/bg-music.mp3" 
        loop 
      />

      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70 pointer-events-none"></div>

        <button 
          onClick={toggleSound}
          className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-50 group flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-2 rounded-full bg-black/40 backdrop-blur-md border border-[#D4AF37]/40 hover:bg-black/60 hover:border-[#D4AF37] transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] pointer-events-auto"
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

        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4"
          style={{ 
            opacity: textOpacity, 
            transform: `translateY(${textTranslateY}px)`,
          }}
        >
          <div className="pointer-events-auto flex flex-col items-center z-10 mt-32 sm:mt-40 md:mt-48 animate-float w-full max-w-5xl">
            
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-2 md:mb-3 text-[#F3E5AB]">
              <span className="text-xs md:text-sm">✧</span>
              <span className="font-sans text-[9px] sm:text-[11px] md:text-sm tracking-[0.3em] font-medium uppercase drop-shadow-md">
                This Onam, Let&apos;s Find Our King
              </span>
              <span className="text-xs md:text-sm">✧</span>
            </div>

            {/* Highly Responsive Title Scaling */}
            <h1 
              className="font-[family-name:var(--font-cinzel-decorative)] text-5xl sm:text-7xl md:text-[100px] lg:text-[140px] leading-none tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#D4AF37] to-[#8C6216] mb-2 font-bold w-full" 
              style={{ filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.9))" }}
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

            {/* Highly Responsive Buttons Container */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-none">
              
              {/* PRIMARY Game Button (Restored Gold) */}
              <Link href="/game" className="group w-full sm:w-auto p-[2px] clip-game-button bg-gradient-to-b from-[#FFF0B3] to-[#8C6216] shadow-[0_0_40px_rgba(212,175,55,0.4)] animate-heartbeat btn-hover-effect transition-all duration-200 ease-out">
                <div className="clip-game-button bg-premium-gold px-8 sm:px-10 md:px-12 py-3.5 flex items-center justify-center gap-3 w-full">
                  <span className="font-sans font-extrabold tracking-widest text-[11px] md:text-[13px] uppercase text-[#2B1B04] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                    Start The Hunt
                  </span>
                  <svg className="w-4 h-4 text-[#2B1B04] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
              </Link>
              
              {/* SECONDARY Game Button (Glass) */}
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
      </div>
    </div>
  );
}