"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

// Define our data types
type Team = { id: string; team_name: string; score: number; current_clue: number; passcode: string };
type Clue = { id: number; title: string; content: string; answer: string; hint: string };

export default function GamePage() {
  // Authentication State
  const [team, setTeam] = useState<Team | null>(null);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Game State
  const [clue, setClue] = useState<Clue | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "error" | "success" | null }>({ message: "", type: null });
  const [totalClues, setTotalClues] = useState(3); // We added 3 clues to the DB

  // --- LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeInput.trim()) return;
    setIsLoggingIn(true);
    setLoginError("");

    try {
      // 1. Check if the passcode exists in the DB
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .eq("passcode", passcodeInput.trim().toUpperCase())
        .single();

      if (teamError || !teamData) throw new Error("Invalid Passcode.");

      // 2. Set the team and fetch their current clue
      setTeam(teamData);
      fetchClue(teamData.current_clue);

    } catch (error: any) {
      setLoginError("INVALID PASSCODE. THE TRAIL REMAINS HIDDEN.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // --- FETCH CLUE LOGIC ---
  const fetchClue = async (clueId: number) => {
    const { data: clueData } = await supabase
      .from("clues")
      .select("*")
      .eq("id", clueId)
      .single();

    if (clueData) {
      setClue(clueData);
      setShowHint(false);
      setAnswerInput("");
    } else {
      // If no clue is found for their number, they have finished the game!
      setClue(null);
    }
  };

  // --- SUBMIT ANSWER LOGIC ---
  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || isTransitioning || !clue || !team) return;

    const cleanInput = answerInput.trim().toUpperCase();

    if (cleanInput === clue.answer.toUpperCase()) {
      setFeedback({ message: "KEY ACCEPTED. UNLOCKING...", type: "success" });
      setIsTransitioning(true);
      
      const pointsEarned = showHint ? 50 : 100;
      const newScore = team.score + pointsEarned;
      const nextClueId = team.current_clue + 1;

      // 1. Update the team's progress in the database
      await supabase
        .from("teams")
        .update({ score: newScore, current_clue: nextClueId })
        .eq("id", team.id);

      // 2. Log the action for audit/tie-breakers
      await supabase
        .from("game_logs")
        .insert([{ team_id: team.id, clue_id: clue.id, action_type: 'SOLVED', points_awarded: pointsEarned }]);

      // 3. Progress the UI after a cinematic delay
      setTimeout(() => {
        setTeam({ ...team, score: newScore, current_clue: nextClueId });
        fetchClue(nextClueId);
        setFeedback({ message: "", type: null });
        setIsTransitioning(false);
      }, 2000);
    } else {
      setFeedback({ message: "INVALID KEY. THE TRAIL REMAINS HIDDEN.", type: "error" });
      setTimeout(() => setFeedback({ message: "", type: null }), 3000);
    }
  };

  const handleUseHint = async () => {
    if (hintsRemaining > 0 && !showHint && team && clue) {
      setHintsRemaining(prev => prev - 1);
      setShowHint(true);
      // Log hint usage
      await supabase.from("game_logs").insert([{ team_id: team.id, clue_id: clue.id, action_type: 'HINT_USED', points_awarded: 0 }]);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D2B1D] bg-[url('/BG.png')] bg-cover bg-center bg-fixed text-[#FDFBF7] flex flex-col font-sans">
      <div className="fixed inset-0 bg-gradient-to-b from-[#0D2B1D]/90 via-black/80 to-[#0D2B1D]/95 z-0 pointer-events-none"></div>
      
      <div className="relative z-50">
        <Navbar />
      </div>

      <section className="relative z-10 flex-grow pt-32 pb-20 px-4 md:px-6 flex flex-col items-center justify-center">
        
        {/* ========================================= */}
        {/* STATE 1: LOGIN SCREEN (Not Authenticated) */}
        {/* ========================================= */}
        {!team && (
          <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-8 md:p-12 animate-fade-in text-center">
            <div className="w-16 h-16 mx-auto rounded-full border border-[#D4AF37]/50 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <svg className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            
            <h2 className="font-serif text-2xl md:text-3xl text-[#FDFBF7] mb-2 drop-shadow-md">Access Terminal</h2>
            <p className="font-sans text-[10px] text-white/50 tracking-[0.2em] uppercase mb-8">Enter your team passcode to resume the hunt</p>

            {loginError && (
              <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-[10px] tracking-[0.2em] uppercase font-bold">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value.toUpperCase())}
                  placeholder="6-DIGIT CODE"
                  maxLength={6}
                  className="w-full bg-transparent border-b border-white/20 pb-4 text-center text-[#D4AF37] font-sans font-bold tracking-[0.4em] text-xl md:text-2xl uppercase placeholder-white/10 focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                  autoComplete="off"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoggingIn || passcodeInput.length < 6}
                className={`w-full group relative p-[2px] clip-game-button bg-gradient-to-b from-[#FFF0B3] to-[#8C6216] shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 ${isLoggingIn || passcodeInput.length < 6 ? 'opacity-50 cursor-not-allowed' : 'btn-hover-effect'}`}
              >
                <div className="clip-game-button bg-premium-gold px-12 py-3.5 flex items-center justify-center">
                  <span className="font-sans font-extrabold tracking-[0.2em] text-[12px] uppercase text-[#2B1B04]">
                    {isLoggingIn ? "Authenticating..." : "Initialize"}
                  </span>
                </div>
              </button>
            </form>
          </div>
        )}

        {/* ========================================= */}
        {/* STATE 2: ACTIVE GAME (Authenticated & Clue exists) */}
        {/* ========================================= */}
        {team && clue && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            
            {/* Top HUD */}
            <div className="absolute top-24 md:top-28 left-0 w-full px-4 md:px-12 flex justify-between items-start pointer-events-none">
              <div className="flex flex-col gap-1 md:gap-2">
                <span className="text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase text-[#D4AF37]">Team {team.team_name}</span>
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="font-serif text-xl md:text-3xl text-[#FDFBF7] drop-shadow-md">{(team.current_clue).toString().padStart(2, '0')}</span>
                  <div className="w-16 md:w-32 h-[2px] bg-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-[#D4AF37] transition-all duration-700 shadow-[0_0_15px_#D4AF37]" style={{ width: `${((team.current_clue) / totalClues) * 100}%` }}></div>
                  </div>
                  <span className="font-serif text-sm md:text-xl text-white/30">{totalClues.toString().padStart(2, '0')}</span>
                </div>
              </div>
              <div className="flex gap-4 md:gap-8 text-right">
                <div className="flex flex-col">
                  <span className="text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase text-white/50 mb-1">Score</span>
                  <span className="font-serif text-xl md:text-2xl text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">{team.score}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase text-white/50 mb-1">Hints</span>
                  <span className="font-serif text-xl md:text-2xl text-[#FDFBF7]">{hintsRemaining}</span>
                </div>
              </div>
            </div>

            {/* Main Clue Interface */}
            <div className={`w-full max-w-3xl transition-all duration-1000 mt-12 md:mt-0 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-4 mb-4 md:mb-6 text-[#F3E5AB]">
                  <span className="text-[10px] md:text-xs">✧</span>
                  <span className="font-sans text-[10px] md:text-xs tracking-[0.4em] font-medium uppercase drop-shadow-md">
                    {clue.title}
                  </span>
                  <span className="text-[10px] md:text-xs">✧</span>
                </div>

                <p className="font-[family-name:var(--font-cinzel-decorative)] text-[#FDFBF7] text-xl md:text-3xl lg:text-4xl leading-relaxed whitespace-pre-line mb-10 md:mb-16 drop-shadow-lg px-2">
                  &ldquo;{clue.content}&rdquo;
                </p>

                <form onSubmit={handleAnswerSubmit} className="w-full max-w-lg mx-auto flex flex-col items-center px-4">
                  <div className="relative w-full mb-6 md:mb-8">
                    <input
                      type="text"
                      value={answerInput}
                      onChange={(e) => setAnswerInput(e.target.value)}
                      disabled={isTransitioning}
                      placeholder="ENTER THE KEY..."
                      className="w-full bg-transparent border-b border-white/20 pb-3 md:pb-4 text-center text-[#D4AF37] font-sans font-bold tracking-[0.2em] md:tracking-[0.3em] text-base md:text-lg uppercase placeholder-white/10 focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                      autoComplete="off"
                    />
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#D4AF37] shadow-[0_0_15px_#D4AF37] transition-all duration-500 ${answerInput.length > 0 ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
                  </div>

                  <div className="h-6 mb-6 md:mb-8">
                    {feedback.message && (
                      <div className={`text-[9px] md:text-[11px] tracking-[0.2em] md:tracking-[0.3em] uppercase font-bold transition-opacity duration-300 ${feedback.type === 'error' ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]' : 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]'}`}>
                        {feedback.message}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-4 md:gap-6 w-full">
                    <button type="submit" disabled={isTransitioning} className="group relative p-[2px] clip-game-button bg-gradient-to-b from-[#FFF0B3] to-[#8C6216] shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] btn-hover-effect transition-all duration-300 w-full md:w-auto">
                      <div className="clip-game-button bg-premium-gold px-12 md:px-16 py-3.5 md:py-4 flex items-center justify-center gap-3 w-full">
                        <span className="font-sans font-extrabold tracking-[0.2em] text-[11px] md:text-[13px] uppercase text-[#2B1B04]">Unlock</span>
                      </div>
                    </button>

                    <div className="h-16 md:h-20 w-full flex justify-center items-center">
                      {!showHint ? (
                        <button type="button" onClick={handleUseHint} disabled={hintsRemaining === 0 || isTransitioning} className={`font-sans text-[9px] md:text-[10px] tracking-[0.2em] uppercase transition-all flex items-center gap-2 ${hintsRemaining > 0 ? 'text-white/40 hover:text-[#D4AF37]' : 'text-white/10 cursor-not-allowed'}`}>
                          [ Request Hint ]
                        </button>
                      ) : (
                        <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-md p-3 md:p-4 flex gap-3 md:gap-4 items-start w-full max-w-md animate-fade-in shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                          <span className="text-[#D4AF37] text-sm md:text-lg">💡</span>
                          <p className="font-sans text-[10px] md:text-xs tracking-wide text-[#FDFBF7]/70 italic text-left leading-relaxed">
                            {clue.hint}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* STATE 3: VICTORY SCREEN (Completed all clues) */}
        {/* ========================================= */}
        {team && !clue && (
          <div className="max-w-3xl animate-float text-center px-4 mt-20 md:mt-0">
            <div className="flex items-center justify-center gap-4 mb-4 md:mb-6 text-[#F3E5AB]">
               <span className="text-[10px] md:text-sm">✧</span>
               <span className="font-sans text-[10px] md:text-xs tracking-[0.4em] font-medium uppercase drop-shadow-md">Trail Completed</span>
               <span className="text-[10px] md:text-sm">✧</span>
             </div>
            <h1 className="font-[family-name:var(--font-cinzel-decorative)] text-5xl md:text-8xl lg:text-[100px] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#D4AF37] to-[#8C6216] font-bold mb-4 md:mb-6 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
               MAHABALI FOUND
            </h1>
            <p className="font-sans text-xs md:text-base lg:text-lg text-[#FDFBF7]/80 tracking-widest mb-10 md:mb-12 max-w-xl mx-auto leading-loose">
              You have successfully navigated the open web and uncovered the hidden trail. 
              <br/><br/>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">Final Score</span><br/>
              <span className="text-[#D4AF37] font-bold text-3xl md:text-4xl drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">{team.score}</span>
            </p>
            <Link href="/leaderboard" className="inline-block group p-[2px] clip-game-button bg-gradient-to-b from-[#D4AF37] to-[#7A5C13] shadow-[0_0_20px_rgba(0,0,0,0.5)] btn-hover-effect">
               <div className="clip-game-button bg-premium-glass px-10 md:px-12 py-3.5 md:py-4 flex items-center justify-center">
                 <span className="font-sans font-bold tracking-[0.1em] md:tracking-widest text-[11px] md:text-[13px] uppercase text-[#FDFBF7]">
                   View Leaderboard
                 </span>
               </div>
             </Link>
          </div>
        )}
      </section>
    </main>
  );
}