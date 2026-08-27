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
  const [finishedCount, setFinishedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // 1. Check if the admin revealed the true leaderboard
        const { data: stateData } = await supabase.from("game_state").select("is_leaderboard_revealed").eq("id", 1).single();
        const revealed = stateData?.is_leaderboard_revealed || false;
        setIsRevealed(revealed);

        // 2. Fetch all teams
        const { data, error } = await supabase.from("teams").select("id, team_name, score, current_clue");
        if (error) throw error;
        
        if (data) {
          if (revealed) {
            // GRAND REVEAL: Sort everyone entirely by score, showing the true victors!
            data.sort((a, b) => b.score - a.score);
            setTeams(data);
          } else {
            // MYSTERY MODE: Filter out teams that have finished and scramble them
            const finishedTeams = data.filter(t => t.current_clue > 5);
            finishedTeams.sort((a, b) => a.team_name.localeCompare(b.team_name));

            // Filter out active teams and sort them by SCORE (Descending)
            const activeTeams = data.filter(t => t.current_clue <= 5);
            activeTeams.sort((a, b) => b.score - a.score);

            setTeams([...finishedTeams, ...activeTeams]);
            setFinishedCount(finishedTeams.length);
          }
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000); // Check every 10s for the reveal!
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black bg-[url('/BG.png')] bg-cover bg-center bg-fixed text-[#FDFBF7] font-sans">
      <div className="fixed inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95 z-0 pointer-events-none"></div>
      <div className="relative z-50"><Navbar /></div>

      <section className="relative z-10 pt-32 pb-20 px-4 md:px-12 max-w-5xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-10 md:mb-14 animate-float" style={{ animationDuration: '4s' }}>
          <div className="flex items-center justify-center gap-4 mb-4 text-[#F3E5AB]">
            <span className="text-xs">✧</span>
            <span className="font-sans text-[10px] md:text-[11px] tracking-[0.3em] font-bold uppercase drop-shadow-md">
              {isRevealed ? "The True Champions" : "The Hall of Kings"}
            </span>
            <span className="text-xs">✧</span>
          </div>
          <h1 className={`font-[family-name:var(--font-cinzel-decorative)] text-4xl md:text-6xl lg:text-7xl font-bold mb-4 ${isRevealed ? 'text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] to-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]' : 'text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#D4AF37] to-[#8C6216] drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]'}`}>
            Leaderboard
          </h1>
          <p className={`font-sans text-[10px] md:text-xs tracking-widest uppercase drop-shadow-md max-w-xl mx-auto leading-relaxed border p-3 rounded ${isRevealed ? 'border-green-500/50 bg-green-900/20 text-green-400' : 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]'}`}>
            {isRevealed ? "THE CURTAIN HAS FALLEN. FINAL STANDINGS ARE REVEALED." : "Live Standings. Completed teams are grouped alphabetically to preserve the mystery of the true Victor!"}
          </p>
        </div>

        <div className="w-full max-w-4xl bg-black/40 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="grid grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-4 border-b border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/50 font-bold">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-6 md:col-span-7">Team Name</div>
            <div className="col-span-4 md:col-span-3 text-right">Score</div>
          </div>

          <div className="flex flex-col min-h-[300px]">
            {isLoading ? (
              <div className="flex-grow flex items-center justify-center text-[#D4AF37] text-xs tracking-widest uppercase animate-pulse">Syncing Network...</div>
            ) : teams.length === 0 ? (
              <div className="flex-grow flex items-center justify-center text-white/40 text-xs tracking-widest uppercase">No teams have registered yet.</div>
            ) : (
              teams.map((team, index) => {
                const hasFinished = team.current_clue > 5;
                
                // If revealed, EVERYONE gets a straight rank. If not, only active teams get a rank number.
                const displayRank = isRevealed ? index + 1 : (index - finishedCount + 1); 
                
                let rankStyle = "text-[#FDFBF7]/70";
                let rowStyle = "border-b border-white/5 hover:bg-white/5";
                let icon = null;

                if (!isRevealed && hasFinished) {
                  rankStyle = "text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]";
                  rowStyle = "border-b border-[#D4AF37]/20 bg-[#D4AF37]/5"; 
                } else {
                  if (displayRank === 1) {
                    rankStyle = "text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]";
                    rowStyle = "border-b border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/10 to-transparent";
                    icon = <span className="text-sm md:text-xl">👑</span>;
                  } else if (displayRank === 2) {
                    rankStyle = "text-[#C0C0C0] drop-shadow-[0_0_10px_rgba(192,192,192,0.8)]";
                    rowStyle = "border-b border-[#C0C0C0]/20 bg-gradient-to-r from-[#C0C0C0]/5 to-transparent";
                    if (isRevealed) icon = <span className="text-sm md:text-xl">🥈</span>;
                  } else if (displayRank === 3) {
                    rankStyle = "text-[#CD7F32] drop-shadow-[0_0_10px_rgba(205,127,50,0.8)]";
                    rowStyle = "border-b border-[#CD7F32]/20 bg-gradient-to-r from-[#CD7F32]/5 to-transparent";
                    if (isRevealed) icon = <span className="text-sm md:text-xl">🥉</span>;
                  }
                }

                return (
                  <div key={team.id} className={`grid grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-4 md:py-5 items-center transition-colors duration-300 ${rowStyle}`}>
                    <div className="col-span-2 flex justify-center items-center gap-1 md:gap-2">
                      {icon && <div className="hidden md:block">{icon}</div>}
                      
                      {!isRevealed && hasFinished ? (
                        <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      ) : (
                        <span className={`font-serif text-lg md:text-2xl font-bold ${rankStyle}`}>
                          {displayRank.toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>
                    
                    <div className="col-span-6 md:col-span-7 flex flex-col">
                      <span className={`font-sans text-xs md:text-base tracking-widest font-bold truncate ${hasFinished || displayRank <= 3 ? 'text-[#FDFBF7]' : 'text-[#FDFBF7]/80'}`}>
                        {team.team_name}
                      </span>
                      <span className={`font-sans text-[8px] md:text-[10px] tracking-widest mt-1 uppercase ${hasFinished ? 'text-[#D4AF37] font-bold drop-shadow-md' : 'text-white/30'}`}>
                        {hasFinished ? 'Status: Trail Completed' : 'Status: Investigating...'}
                      </span>
                    </div>
                    
                    <div className="col-span-4 md:col-span-3 flex justify-end items-center">
                      {!isRevealed && hasFinished ? (
                        <span className="font-sans text-[8px] md:text-[10px] tracking-[0.2em] font-bold text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2 py-1 rounded border border-[#D4AF37]/30 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                          Classified
                        </span>
                      ) : (
                        <span className={`font-serif text-base md:text-xl font-bold ${displayRank === 1 ? 'text-[#D4AF37]' : 'text-[#FDFBF7]'}`}>
                          {team.score}
                        </span>
                      )}
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