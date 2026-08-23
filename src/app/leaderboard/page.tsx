"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

type Team = {
  id: string;
  team_name: string;
  score: number;
  current_clue: number;
};

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch teams ordered by score (highest first)
        const { data, error } = await supabase
          .from("teams")
          .select("id, team_name, score, current_clue")
          .order("score", { ascending: false });

        if (error) throw error;
        if (data) setTeams(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <main className="min-h-screen bg-[#0D2B1D] bg-[url('/BG.png')] bg-cover bg-center bg-fixed text-[#FDFBF7] font-sans">
      <div className="fixed inset-0 bg-gradient-to-b from-[#0D2B1D]/90 via-black/80 to-[#0D2B1D]/95 z-0 pointer-events-none"></div>
      
      <div className="relative z-50">
        <Navbar />
      </div>

      <section className="relative z-10 pt-32 pb-20 px-4 md:px-12 max-w-5xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-12 md:mb-16 animate-float" style={{ animationDuration: '4s' }}>
          <div className="flex items-center justify-center gap-4 mb-4 text-[#F3E5AB]">
            <span className="text-xs">✧</span>
            <span className="font-sans text-[10px] md:text-[11px] tracking-[0.3em] font-bold uppercase drop-shadow-md">The Hall of Kings</span>
            <span className="text-xs">✧</span>
          </div>
          <h1 className="font-[family-name:var(--font-cinzel-decorative)] text-4xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#D4AF37] to-[#8C6216] font-bold mb-4 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
            Leaderboard
          </h1>
          <p className="font-sans text-[10px] md:text-xs text-[#FDFBF7]/60 tracking-widest uppercase drop-shadow-md">
            Live Open Web Investigation Standings
          </p>
        </div>

        {/* --- LEADERBOARD TABLE --- */}
        <div className="w-full max-w-4xl bg-black/40 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
          
          <div className="grid grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-4 border-b border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/50 font-bold">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-6 md:col-span-7">Team Name</div>
            <div className="col-span-4 md:col-span-3 text-right">Score</div>
          </div>

          <div className="flex flex-col min-h-[300px]">
            {isLoading ? (
              <div className="flex-grow flex items-center justify-center text-[#D4AF37] text-xs tracking-widest uppercase animate-pulse">
                Syncing Network...
              </div>
            ) : teams.length === 0 ? (
              <div className="flex-grow flex items-center justify-center text-white/40 text-xs tracking-widest uppercase">
                No teams have registered yet.
              </div>
            ) : (
              teams.map((team, index) => {
                const rank = index + 1;
                let rankStyle = "text-[#FDFBF7]/70";
                let rowStyle = "border-b border-white/5 hover:bg-white/5";
                let icon = null;

                if (rank === 1) {
                  rankStyle = "text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]";
                  rowStyle = "border-b border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/10 to-transparent";
                  icon = <span className="text-sm md:text-xl">👑</span>;
                } else if (rank === 2) {
                  rankStyle = "text-[#C0C0C0] drop-shadow-[0_0_10px_rgba(192,192,192,0.8)]";
                  rowStyle = "border-b border-[#C0C0C0]/20 bg-gradient-to-r from-[#C0C0C0]/5 to-transparent";
                } else if (rank === 3) {
                  rankStyle = "text-[#CD7F32] drop-shadow-[0_0_10px_rgba(205,127,50,0.8)]";
                  rowStyle = "border-b border-[#CD7F32]/20 bg-gradient-to-r from-[#CD7F32]/5 to-transparent";
                }

                return (
                  <div key={team.id} className={`grid grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-4 md:py-5 items-center transition-colors duration-300 ${rowStyle}`}>
                    <div className="col-span-2 flex justify-center items-center gap-1 md:gap-2">
                      {icon && <div className="hidden md:block">{icon}</div>}
                      <span className={`font-serif text-lg md:text-2xl font-bold ${rankStyle}`}>
                        {rank.toString().padStart(2, '0')}
                      </span>
                    </div>
                    
                    <div className="col-span-6 md:col-span-7 flex flex-col">
                      <span className={`font-sans text-xs md:text-base tracking-widest font-bold truncate ${rank <= 3 ? 'text-[#FDFBF7]' : 'text-[#FDFBF7]/80'}`}>
                        {team.team_name}
                      </span>
                      <span className="font-sans text-[8px] md:text-[10px] text-white/40 tracking-widest mt-1 uppercase">
                        Current Clue: {team.current_clue}
                      </span>
                    </div>
                    
                    <div className="col-span-4 md:col-span-3 text-right">
                      <span className={`font-serif text-base md:text-xl font-bold ${rank === 1 ? 'text-[#D4AF37]' : 'text-[#FDFBF7]'}`}>
                        {team.score}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-12">
          <Link href="/" className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/50 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
            <svg className="w-3 h-3 md:w-4 md:h-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            Return to Homepage
          </Link>
        </div>
      </section>
    </main>
  );
}