"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

// Define our data types
type Team = { id: string; team_name: string; score: number; current_clue: number; passcode: string };
type Clue = { id: number; title: string; content: string; answer: string; hint: string };

// --- EVENT TIMESTAMPS (IST) ---
const EVENT_START = new Date('2026-08-26T19:30:00+05:30').getTime();
const EVENT_END = new Date('2026-08-28T20:30:00+05:30').getTime();
const TOTAL_CLUES = 5;

// --- CLUE URL MAPPING ---
// Maps the Clue ID to the specific open web resource they need to investigate
const EXPLORE_LINKS: Record<number, string> = {
  1: "https://stellarium-web.org/",
  2: "https://www.openstreetmap.org/",
  3: "https://commons.wikimedia.org/",
  4: "https://www.openstreetmap.org/",
  5: "#" // Final destination (they will figure this out)
};

export default function GamePage() {
  // Time & View State
  const [timeStatus, setTimeStatus] = useState<"loading" | "waiting" | "active" | "ended">("loading");
  const [showMapTransition, setShowMapTransition] = useState(false);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "error" | "success" | null }>({ message: "", type: null });

  // --- TIME LOCK LOGIC ---
  useEffect(() => {
    const checkTime = () => {
      const now = Date.now();
      if (now < EVENT_START) {
        setTimeStatus("waiting");
      } else if (now >= EVENT_START && now < EVENT_END) {
        setTimeStatus("active");
      } else {
        setTimeStatus("ended");
      }
    };

    checkTime();
    const timer = setInterval(checkTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeInput.trim()) return;
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .eq("passcode", passcodeInput.trim().toUpperCase())
        .single();

      if (teamError || !teamData) throw new Error("Invalid Passcode.");

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
      setClue(null); // No clue found = Victory Screen
    }
  };

  // --- SUBMIT ANSWER LOGIC ---
  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || isSubmitting || !clue || !team) return;

    const cleanInput = answerInput.trim().toUpperCase();

    if (cleanInput === clue.answer.toUpperCase()) {
      setFeedback({ message: "KEY ACCEPTED. UNLOCKING...", type: "success" });
      setIsSubmitting(true);
      
      // Calculate Score: 100 if clean, 50 if hint used (50 points lost)
      const pointsEarned = showHint ? 50 : 100;
      const newScore = team.score + pointsEarned;
      const nextClueId = team.current_clue + 1;

      await supabase
        .from("teams")
        .update({ score: newScore, current_clue: nextClueId })
        .eq("id", team.id);

      await supabase
        .from("game_logs")
        .insert([{ team_id: team.id, clue_id: clue.id, action_type: 'SOLVED', points_awarded: pointsEarned }]);

      // After 1.5 seconds, show the Map Progress Screen!
      setTimeout(() => {
        setTeam({ ...team, score: newScore, current_clue: nextClueId });
        setShowMapTransition(true); 
        setFeedback({ message: "", type: null });
        setIsSubmitting(false);
      }, 1500);

    } else {
      setFeedback({ message: "INVALID KEY. THE TRAIL REMAINS HIDDEN.", type: "error" });
      setTimeout(() => setFeedback({ message: "", type: null }), 3000);
    }
  };

  const handleUseHint = async () => {
    // --- UPDATED WARNING MESSAGE ---
    const confirmHint = window.confirm(`WARNING: Using this hint will deduct 50 points from this clue's total. \n\nRemember, ONLY 3 HINTS can be used throughout the entire game! (You have ${hintsRemaining} left).\n\nDo you wish to proceed?`);
    
    if (confirmHint && hintsRemaining > 0 && !showHint && team && clue) {
      setHintsRemaining(prev => prev - 1);
      setShowHint(true);
      await supabase.from("game_logs").insert([{ team_id: team.id, clue_id: clue.id, action_type: 'HINT_USED', points_awarded: 0 }]);
    }
  };

  // Function to proceed from Map to Next Clue
  const handleProceedFromMap = () => {
    setShowMapTransition(false);
    if (team) {
      fetchClue(team.current_clue);
    }
  };

  if (timeStatus === "loading") return null;

  return (
    <main className="min-h-screen flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#2B1B04]">
      
      {/* GLOBAL BACKGROUND - The Wooden Desk */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/wooden-desk.png')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/60 pointer-events-none"></div> {/* Cinematic darkening */}
      </div>
      
      <div className="relative z-50">
        <Navbar />
      </div>

      <section className="relative z-10 flex-grow pt-32 pb-20 px-4 md:px-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        
        {/* ========================================= */}
        {/* STATE 0: WAITING FOR EVENT TO START       */}
        {/* ========================================= */}
        {timeStatus === "waiting" && (
          <div className="max-w-xl text-center px-4 animate-float bg-black/60 backdrop-blur-md p-10 rounded-xl border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="w-20 h-20 mx-auto rounded-full border border-red-500/50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,0,0,0.3)]">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-red-500 mb-4 tracking-widest uppercase drop-shadow-md">
              Terminal Locked
            </h2>
            <p className="font-sans text-xs md:text-sm text-white/70 tracking-[0.2em] leading-loose max-w-md mx-auto">
              The hunt has not yet begun. The access terminal will automatically unlock at exactly <strong className="text-[#D4AF37]">7:30 PM IST</strong> on August 28th.
            </p>
          </div>
        )}

        {/* ========================================= */}
        {/* STATE 4: EVENT ENDED                      */}
        {/* ========================================= */}
        {timeStatus === "ended" && !(!clue && team) && (
          <div className="max-w-xl text-center px-4 animate-fade-in bg-black/60 backdrop-blur-md p-10 rounded-xl border border-white/20">
            <h2 className="font-serif text-3xl md:text-5xl text-white/50 mb-4 tracking-widest uppercase">
              Time Expired
            </h2>
            <p className="font-sans text-xs md:text-sm text-[#D4AF37] tracking-[0.2em] leading-loose max-w-md mx-auto">
              The 60-minute window has closed. The trail has gone cold. Check the Leaderboard for the final results!
            </p>
            <Link href="/leaderboard" className="inline-block mt-8 text-xs tracking-widest uppercase text-white hover:text-[#D4AF37] transition-colors border border-white/20 hover:border-[#D4AF37] px-6 py-3 rounded">
              View Leaderboard
            </Link>
          </div>
        )}

        {/* ========================================= */}
        {/* ACTIVE GAME STATES (Login, Play, Victory) */}
        {/* ========================================= */}
        {timeStatus === "active" && (
          <>
            {/* LOGIN SCREEN */}
            {!team && (
              <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-8 md:p-12 animate-fade-in text-center">
                <div className="w-16 h-16 mx-auto rounded-full border border-[#D4AF37]/50 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <svg className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                
                <h2 className="font-serif text-2xl md:text-3xl text-[#FDFBF7] mb-2 drop-shadow-md">Access Terminal</h2>
                <p className="font-sans text-[10px] text-white/50 tracking-[0.2em] uppercase mb-8">Enter your team passcode to initiate</p>

                {loginError && (
                  <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-[10px] tracking-[0.2em] uppercase font-bold">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-8">
                  <input
                    type="text"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value.toUpperCase())}
                    placeholder="6-DIGIT CODE"
                    maxLength={6}
                    className="w-full bg-transparent border-b border-white/20 pb-4 text-center text-[#D4AF37] font-sans font-bold tracking-[0.4em] text-xl md:text-2xl uppercase placeholder-white/10 focus:outline-none focus:border-[#D4AF37] transition-all duration-300"
                    autoComplete="off"
                  />
                  <button 
                    type="submit" 
                    disabled={isLoggingIn || passcodeInput.length < 6}
                    className={`w-full group relative p-[2px] clip-game-button bg-gradient-to-b from-[#FFF0B3] to-[#8C6216] shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 ${isLoggingIn || passcodeInput.length < 6 ? 'opacity-50 cursor-not-allowed' : 'btn-hover-effect'}`}
                  >
                    <div className="clip-game-button bg-[#0D2B1D] px-12 py-3.5 flex items-center justify-center">
                      <span className="font-sans font-bold tracking-[0.2em] text-[12px] uppercase text-[#D4AF37]">
                        {isLoggingIn ? "Authenticating..." : "Initialize"}
                      </span>
                    </div>
                  </button>
                </form>
              </div>
            )}

            {/* MAP TRANSITION SCREEN */}
            {team && showMapTransition && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black animate-fade-in">
                <div className="absolute inset-0 bg-[url('/fantasy-map.png')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center">
                  <h2 className="font-[family-name:var(--font-cinzel-decorative)] text-4xl md:text-6xl text-[#D4AF37] drop-shadow-[0_0_20px_rgba(212,175,55,0.8)] mb-6">
                    {team.current_clue > TOTAL_CLUES ? "Final Destination Reached" : "Journey Progress"}
                  </h2>
                  
                  {/* Progress Nodes */}
                  <div className="flex items-center gap-2 md:gap-4 mb-16 w-full justify-center">
                    {[1, 2, 3, 4, 5].map((nodeNum) => {
                      const isCompleted = nodeNum < team.current_clue;
                      const isCurrent = nodeNum === team.current_clue;
                      const isLocked = nodeNum > team.current_clue;

                      return (
                        <div key={nodeNum} className="flex items-center">
                          <div className={`w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 
                            ${isCompleted ? 'bg-green-600/80 border-green-400 shadow-[0_0_15px_#4ade80]' : 
                              isCurrent ? 'bg-[#D4AF37]/80 border-[#FFF0B3] shadow-[0_0_20px_#D4AF37] animate-pulse' : 
                              'bg-black/50 border-white/20'}`}
                          >
                            {isCompleted && <span className="text-white text-[10px] md:text-sm">✓</span>}
                            {isCurrent && <span className="text-black text-[10px] md:text-sm font-bold">{nodeNum}</span>}
                            {isLocked && <span className="text-white/30 text-[10px] md:text-sm font-bold">{nodeNum}</span>}
                          </div>
                          {nodeNum !== 5 && (
                            <div className={`h-1 w-8 md:w-16 transition-all duration-700 ${isCompleted ? 'bg-green-500/50' : 'bg-white/10'}`}></div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={handleProceedFromMap} 
                    className="group relative p-[2px] bg-gradient-to-b from-[#FFF0B3] to-[#8C6216] shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] transition-all duration-300"
                  >
                    <div className="bg-[#111] px-12 md:px-16 py-4 flex items-center justify-center">
                      <span className="font-sans font-bold tracking-[0.2em] text-xs md:text-sm uppercase text-[#D4AF37] group-hover:text-[#FFF0B3] transition-colors">
                        {team.current_clue > TOTAL_CLUES ? "Claim Victory" : "Proceed to Next Destination"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE CLUE ON PARCHMENT */}
            {team && clue && !showMapTransition && (
              <div className="w-full flex flex-col items-center justify-center animate-fade-in relative z-20 mt-10 md:mt-0">
                
                {/* HUD Elements */}
                <div className="absolute -top-16 left-0 right-0 flex justify-between items-center px-4 w-full max-w-4xl mx-auto drop-shadow-lg">
                  <div className="flex flex-col">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-bold">Team {team.team_name}</span>
                    <span className="font-serif text-white/50 text-xs">Clue {clue.id} of {TOTAL_CLUES}</span>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div className="flex flex-col">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-white/50">Score</span>
                      <span className="font-serif text-xl text-[#D4AF37] font-bold">{team.score}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-white/50">Hints Left</span>
                      <span className="font-serif text-xl text-white font-bold">{hintsRemaining}</span>
                    </div>
                  </div>
                </div>

                {/* THE PARCHMENT PAPER CONTAINER */}
                <div className="relative w-full max-w-2xl mx-auto aspect-auto md:min-h-[650px] flex flex-col items-center justify-start p-10 md:p-24 bg-[url('/parchment.png')] bg-[length:100%_100%] bg-no-repeat shadow-[0_20px_50px_rgba(0,0,0,0.8)] filter drop-shadow-2xl">
                  
                  <div className="text-center w-full mt-4 md:mt-0">
                    <div className="flex items-center justify-center gap-3 mb-6 text-[#5c3e21]">
                      <span className="text-xs">⚜</span>
                      <h3 className="font-sans text-[11px] md:text-xs tracking-[0.3em] font-bold uppercase border-b border-[#5c3e21]/30 pb-1">
                        {clue.title}
                      </h3>
                      <span className="text-xs">⚜</span>
                    </div>

                    <p className="font-[family-name:var(--font-cinzel-decorative)] text-[#2B1B04] text-lg md:text-2xl leading-loose whitespace-pre-line mb-10 px-2 font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                      {clue.content}
                    </p>
                    
                    {/* BUTTON 1: EXPLORE THE TRAIL */}
                    <a 
                      href={EXPLORE_LINKS[clue.id] || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-3 mb-10 border-2 border-[#5c3e21] text-[#2B1B04] hover:bg-[#5c3e21] hover:text-[#F3E5AB] font-sans font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase transition-all duration-300 rounded shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10.5 7a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" /></svg>
                      Investigate the Web
                    </a>

                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#5c3e21]/30 to-transparent mb-8"></div>

                    {/* ANSWER FORM */}
                    <form onSubmit={handleAnswerSubmit} className="w-full flex flex-col items-center">
                      
                      <div className="relative w-full max-w-sm mb-4">
                        <input
                          type="text"
                          value={answerInput}
                          onChange={(e) => setAnswerInput(e.target.value)}
                          disabled={isSubmitting}
                          placeholder="ENTER THE SECRET KEY..."
                          className="w-full bg-transparent border-b-2 border-[#5c3e21]/50 pb-2 text-center text-[#2B1B04] font-serif font-bold tracking-[0.2em] text-sm md:text-lg uppercase placeholder-[#5c3e21]/40 focus:outline-none focus:border-[#5c3e21] transition-all duration-300"
                          autoComplete="off"
                        />
                      </div>

                      <div className="h-6 mb-4">
                        {feedback.message && (
                          <div className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-opacity duration-300 ${feedback.type === 'error' ? 'text-red-700' : 'text-green-800'}`}>
                            {feedback.message}
                          </div>
                        )}
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting || !answerInput} 
                        className="bg-[#2B1B04] hover:bg-[#1a1002] disabled:opacity-50 text-[#D4AF37] px-10 py-3 font-sans font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase rounded shadow-lg transition-all duration-300 mb-6"
                      >
                        Submit Answer
                      </button>

                      {/* HINT SECTION */}
                      <div className="w-full flex justify-center mt-2 pb-8 md:pb-0">
                        {!showHint ? (
                          <button 
                            type="button" 
                            onClick={handleUseHint} 
                            disabled={hintsRemaining === 0 || isSubmitting} 
                            className={`font-sans text-[9px] tracking-[0.2em] uppercase transition-all ${hintsRemaining > 0 ? 'text-[#5c3e21]/70 hover:text-red-700 font-bold' : 'text-[#5c3e21]/30 cursor-not-allowed'}`}
                          >
                            [ Request Hint (-50 Points) ]
                          </button>
                        ) : (
                          <div className="bg-[#5c3e21]/10 border border-[#5c3e21]/30 rounded p-4 max-w-sm text-left">
                            <span className="text-[#5c3e21] font-bold text-[10px] tracking-widest uppercase mb-1 block">💡 Discovered Hint</span>
                            <p className="font-serif text-[11px] md:text-sm text-[#2B1B04] italic leading-relaxed">
                              {clue.hint}
                            </p>
                          </div>
                        )}
                      </div>
                    </form>

                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================= */}
        {/* STATE 5: VICTORY SCREEN                   */}
        {/* ========================================= */}
        {team && !clue && !showMapTransition && (
          <div className="max-w-3xl animate-float text-center px-4 mt-20 md:mt-0 bg-black/60 backdrop-blur-md p-10 md:p-16 rounded-2xl border border-[#D4AF37]/50 shadow-[0_0_50px_rgba(212,175,55,0.3)]">
            <div className="flex items-center justify-center gap-4 mb-4 md:mb-6 text-[#F3E5AB]">
               <span className="text-[10px] md:text-sm">✧</span>
               <span className="font-sans text-[10px] md:text-xs tracking-[0.4em] font-bold uppercase drop-shadow-md">Trail Completed</span>
               <span className="text-[10px] md:text-sm">✧</span>
             </div>
            <h1 className="font-[family-name:var(--font-cinzel-decorative)] text-5xl md:text-7xl lg:text-[90px] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#D4AF37] to-[#8C6216] font-bold mb-6 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
               MAHABALI FOUND
            </h1>
            <p className="font-sans text-xs md:text-sm text-[#FDFBF7]/80 tracking-widest mb-10 max-w-xl mx-auto leading-loose">
              You have successfully navigated the open web, deciphered the ancient clues, and uncovered the King's final destination.
              <br/><br/>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Final Score Achieved</span><br/>
              <span className="text-white font-bold text-4xl md:text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] mt-2 inline-block">{team.score}</span>
            </p>
            <Link href="/leaderboard" className="inline-block group p-[2px] bg-gradient-to-b from-[#D4AF37] to-[#7A5C13] shadow-[0_0_20px_rgba(0,0,0,0.5)] btn-hover-effect rounded">
               <div className="bg-[#111] px-10 py-4 flex items-center justify-center rounded-sm">
                 <span className="font-sans font-bold tracking-[0.2em] text-[11px] md:text-xs uppercase text-[#D4AF37] group-hover:text-white transition-colors">
                   View Global Leaderboard
                 </span>
               </div>
             </Link>
          </div>
        )}
      </section>
    </main>
  );
}