"use client";

import Navbar from "@/components/Navbar";

const TIMELINE_EVENTS = [
  {
    date: "August 28, 2026",
    time: "Before 7:30 PM",
    title: "Registration & Initialization",
    desc: "Complete your main registration (₹ 10 fee), join the WhatsApp group, and register your team on this portal to generate your 6-digit Secret Passcode.",
    status: "active" // Active because registration is happening right now!
  },
  {
    date: "August 28, 2026",
    time: "07:30 PM",
    title: "The Portal Unlocks",
    desc: "The clock starts. The Game Terminal goes live. Enter your Secret Passcode to access your first clue and begin the hunt.",
    status: "future" 
  },
  {
    date: "August 28, 2026",
    time: "7:30 PM - 8:30 PM",
    title: "The Open Web Race",
    desc: "Race across Wikimedia, OpenStreetMap, and FOSS datasets. Solve clues to progress. Remember: relying on hints will reduce your score!",
    status: "future"
  },
  {
    date: "August 28, 2026",
    time: "08:30 PM",
    title: "The Trail Goes Cold",
    desc: "The 60-minute window strictly closes. The game terminal locks, and final scores are calculated based on time and hint usage.",
    status: "future"
  },
  {
    date: "August 28, 2026",
    time: "09:00 PM",
    title: "The King is Crowned",
    desc: "The final leaderboard is revealed. The top two teams win the ₹200 and ₹100 prize pool, and King Mahabali is finally found!",
    status: "future"
  }
];

export default function TimelinePage() {
  return (
    <main className="min-h-screen bg-[#0D2B1D] bg-[url('/BG.png')] bg-cover bg-center bg-fixed text-[#FDFBF7] font-sans">
      
      {/* Cinematic Ambient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0D2B1D]/90 via-black/80 to-[#0D2B1D]/95 z-0 pointer-events-none"></div>

      <div className="relative z-50">
        <Navbar />
      </div>

      <section className="relative z-10 pt-40 pb-32 px-6 md:px-12 max-w-5xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-24 animate-float" style={{ animationDuration: '4s' }}>
          <div className="flex items-center justify-center gap-4 mb-4 text-[#F3E5AB]">
            <span className="text-sm">✧</span>
            <span className="font-sans text-[11px] tracking-[0.3em] font-bold uppercase drop-shadow-md">Event Schedule</span>
            <span className="text-sm">✧</span>
          </div>
          <h1 className="font-[family-name:var(--font-cinzel-decorative)] text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#D4AF37] to-[#8C6216] font-bold mb-6 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
            The Timeline
          </h1>
          <p className="font-sans text-sm md:text-lg text-[#FDFBF7]/90 max-w-2xl mx-auto tracking-widest drop-shadow-md uppercase">
            Mark your calendars. A 60-Minute Sprint.
          </p>
        </div>

        {/* --- VERTICAL TIMELINE --- */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Central Glowing Line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent transform md:-translate-x-1/2">
            {/* Bright animated highlight moving down the line */}
            <div className="absolute top-0 w-full h-1/4 bg-gradient-to-b from-transparent via-[#FFF0B3] to-transparent animate-pulse shadow-[0_0_15px_#D4AF37]"></div>
          </div>

          <div className="space-y-12 md:space-y-20">
            {TIMELINE_EVENTS.map((event, index) => {
              const isEven = index % 2 === 0;
              
              // Status Styling
              const isPast = event.status === "past";
              const isActive = event.status === "active";
              
              const nodeColor = isActive ? "bg-[#FFF0B3] shadow-[0_0_20px_#FFF0B3]" : isPast ? "bg-[#D4AF37]/50" : "bg-[#0D2B1D] border-2 border-[#D4AF37]/50";
              const cardOpacity = isPast ? "opacity-60 grayscale-[30%]" : "opacity-100";
              const glowEffect = isActive ? "shadow-[0_0_30px_rgba(212,175,55,0.3)] border-[#D4AF37]" : "shadow-xl border-[#D4AF37]/20";

              return (
                <div key={index} className={`relative flex items-center justify-between w-full ${isEven ? "md:flex-row-reverse" : "md:flex-row"} ${cardOpacity} transition-all duration-500 hover:opacity-100 hover:grayscale-0`}>
                  
                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden md:block w-5/12"></div>
                  
                  {/* Timeline Node (The dot on the line) */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full bg-[#0D2B1D] border border-[#D4AF37]/30 flex items-center justify-center z-20">
                    <div className={`w-3 h-3 rounded-full ${nodeColor} transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`}></div>
                  </div>

                  {/* Content Card */}
                  <div className={`w-full pl-16 md:pl-0 md:w-5/12 flex flex-col ${isEven ? "md:items-start md:text-left" : "md:items-end md:text-right"}`}>
                    
                    {/* Date & Time */}
                    <div className={`mb-3 flex flex-col ${isEven ? "md:items-start" : "md:items-end"}`}>
                      <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] mb-1">{event.time}</span>
                      <span className="font-serif text-lg md:text-xl text-[#FDFBF7] drop-shadow-md">{event.date}</span>
                    </div>

                    {/* Glassmorphism Card */}
                    <div className={`w-full bg-black/40 backdrop-blur-md border rounded-xl p-6 md:p-8 transition-all duration-300 ${glowEffect}`}>
                      <h3 className="font-[family-name:var(--font-cinzel-decorative)] text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-[#FDFBF7] to-[#D4AF37] mb-3 font-bold">
                        {event.title}
                      </h3>
                      <p className={`font-sans text-xs md:text-sm tracking-widest leading-relaxed text-[#FDFBF7]/70 ${isEven ? "md:text-left" : "md:text-right"}`}>
                        {event.desc}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>
    </main>
  );
}