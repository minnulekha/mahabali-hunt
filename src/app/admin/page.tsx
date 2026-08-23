"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";

// --- TYPES ---
type Team = {
  id: string;
  team_name: string;
  captain_email: string;
  college: string;
  member_count: number;
  score: number;
  current_clue: number;
  passcode: string;
  created_at: string;
};

type GameLog = {
  id: string;
  action_type: string;
  points_awarded: number;
  created_at: string;
  teams: { id: string; team_name: string };
  clues: { id: number; title: string };
};

const ADMIN_PASSCODE = "SUDO2026"; 
const TOTAL_CLUES = 3; // Update this if you add more clues to the database!

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"teams" | "logs">("teams");
  const [teams, setTeams] = useState<Team[]>([]);
  const [logs, setLogs] = useState<GameLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State to force UI re-renders for the live playing timers
  const [currentTime, setCurrentTime] = useState(Date.now());

  // --- ADMIN LOGIN ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      setAuthError("ACCESS DENIED. UNAUTHORIZED USER.");
    }
  };

  // --- FETCH DATA ---
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const { data: teamsData, error: teamsError } = await supabase
        .from("teams")
        .select("*")
        .order("created_at", { ascending: false });

      if (teamsError) throw teamsError;
      if (teamsData) setTeams(teamsData);

      // Updated query to fetch IDs so we can match logs to specific teams for the time calculator
      const { data: logsData, error: logsError } = await supabase
        .from("game_logs")
        .select(`
          id, action_type, points_awarded, created_at,
          teams ( id, team_name ),
          clues ( id, title )
        `)
        .order("created_at", { ascending: false });

      if (logsError) throw logsError;
      if (logsData) setLogs(logsData as any);
      
    } catch (error: any) {
      console.error("Error fetching admin data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh data every 15s and update the live timer every 1s
  useEffect(() => {
    let dataInterval: NodeJS.Timeout;
    let timeInterval: NodeJS.Timeout;
    
    if (isAuthenticated) {
      dataInterval = setInterval(fetchDashboardData, 15000);
      timeInterval = setInterval(() => setCurrentTime(Date.now()), 1000);
    }
    return () => {
      clearInterval(dataInterval);
      clearInterval(timeInterval);
    };
  }, [isAuthenticated]);

  // --- TIME CALCULATOR HELPER ---
  const calculateTimeTaken = (team: Team) => {
    const startTime = new Date(team.created_at).getTime();
    const hasFinished = team.current_clue > TOTAL_CLUES;
    let endTime = currentTime;

    if (hasFinished) {
      // Find the exact timestamp of their final successful solve in the logs
      const teamLogs = logs.filter(log => log.teams?.id === team.id && log.action_type === 'SOLVED');
      if (teamLogs.length > 0) {
        // Logs are ordered descending, so the first one is their latest solve
        endTime = new Date(teamLogs[0].created_at).getTime();
      }
    }

    const diffMs = endTime - startTime;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

    const timeString = `${diffHrs}h ${diffMins}m ${diffSecs}s`;

    return {
      timeString,
      hasFinished
    };
  };

  return (
    <main className="min-h-screen bg-[#05130D] text-[#FDFBF7] font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {!isAuthenticated ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[url('/BG.png')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/90 z-0"></div>
          
          <div className="relative z-10 w-full max-w-sm bg-black/80 backdrop-blur-md border border-red-900/50 rounded-lg p-8 shadow-[0_0_50px_rgba(255,0,0,0.1)] text-center">
            <h1 className="font-serif text-2xl text-red-500 mb-2 tracking-widest uppercase">Admin Override</h1>
            <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase mb-8">Restricted Access Area</p>
            
            {authError && <p className="text-red-500 text-[10px] font-bold tracking-widest uppercase mb-6 animate-pulse">{authError}</p>}
            
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <input
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="ENTER OVERRIDE CODE"
                className="w-full bg-black/50 border-b border-red-900/50 pb-2 text-center text-red-400 font-mono tracking-[0.3em] text-sm placeholder-red-900/50 focus:outline-none focus:border-red-500 transition-colors"
              />
              <button type="submit" className="w-full py-3 bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 hover:border-red-500 text-red-500 text-xs tracking-[0.2em] uppercase transition-all">
                Authenticate
              </button>
            </form>
            
            <Link href="/" className="inline-block mt-8 text-[10px] text-white/30 hover:text-white/70 tracking-widest uppercase">
              &larr; Return to Public Sector
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          
          {/* Admin Header */}
          <header className="bg-black border-b border-[#D4AF37]/20 px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
              <h1 className="font-serif text-lg md:text-xl tracking-widest text-[#D4AF37] uppercase">FOSS Command Center</h1>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs font-bold tracking-widest uppercase overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              <button onClick={() => setActiveTab("teams")} className={`px-4 py-2 transition-colors whitespace-nowrap rounded ${activeTab === "teams" ? "text-black bg-[#D4AF37]" : "text-[#D4AF37] hover:bg-[#D4AF37]/10"}`}>
                Teams Data
              </button>
              <button onClick={() => setActiveTab("logs")} className={`px-4 py-2 transition-colors whitespace-nowrap rounded ${activeTab === "logs" ? "text-black bg-[#D4AF37]" : "text-[#D4AF37] hover:bg-[#D4AF37]/10"}`}>
                Audit Logs
              </button>
              <button onClick={fetchDashboardData} className="px-3 py-2 text-white/50 hover:text-white border border-white/20 hover:border-white/50 ml-auto md:ml-4 rounded whitespace-nowrap">
                ↻ Refresh
              </button>
            </div>
          </header>

          {/* Main Dashboard Content */}
          <div className="flex-grow p-4 md:p-8 overflow-x-hidden">
            
            {isLoading && teams.length === 0 ? (
              <div className="flex justify-center items-center h-64 text-[#D4AF37] text-xs tracking-widest uppercase animate-pulse">
                Decrypting Database...
              </div>
            ) : (
              <div className="max-w-7xl mx-auto w-full">
                
                {/* --- TEAMS VIEW --- */}
                {activeTab === "teams" && (
                  <div className="bg-black/40 border border-white/10 rounded-lg overflow-hidden shadow-2xl w-full">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                          <tr className="bg-[#D4AF37]/10 text-[10px] tracking-[0.2em] uppercase text-[#D4AF37]">
                            <th className="p-4 border-b border-[#D4AF37]/20 whitespace-nowrap">Team Name</th>
                            <th className="p-4 border-b border-[#D4AF37]/20">Contact</th>
                            <th className="p-4 border-b border-[#D4AF37]/20 text-center">Score</th>
                            <th className="p-4 border-b border-[#D4AF37]/20 text-center">Clue</th>
                            <th className="p-4 border-b border-[#D4AF37]/20 text-center">Passcode</th>
                            <th className="p-4 border-b border-[#D4AF37]/20 text-right">Time Taken</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teams.map((team) => {
                            const { timeString, hasFinished } = calculateTimeTaken(team);
                            
                            return (
                              <tr key={team.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-xs text-white/80">
                                <td className="p-4 font-bold text-white whitespace-nowrap">{team.team_name}</td>
                                <td className="p-4 text-white/50 whitespace-nowrap">{team.captain_email}</td>
                                <td className="p-4 text-center text-[#D4AF37] font-bold text-sm">{team.score}</td>
                                <td className="p-4 text-center">
                                  {hasFinished ? (
                                    <span className="text-green-400 font-bold tracking-widest text-[10px] uppercase">Finished</span>
                                  ) : (
                                    team.current_clue
                                  )}
                                </td>
                                <td className="p-4 text-center">
                                  <span className="px-2 py-1 bg-red-900/30 text-red-400 border border-red-900/50 font-mono tracking-widest rounded">
                                    {team.passcode}
                                  </span>
                                </td>
                                <td className="p-4 text-right font-mono tracking-widest">
                                  <div className="flex flex-col items-end">
                                    <span className={hasFinished ? "text-green-400 font-bold" : "text-white"}>{timeString}</span>
                                    <span className={`text-[9px] uppercase mt-1 ${hasFinished ? "text-green-400/50" : "text-yellow-500/50"}`}>
                                      {hasFinished ? "Final Time" : "Playing"}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {teams.length === 0 && <p className="text-center p-8 text-white/40 text-xs uppercase tracking-widest">No teams registered yet.</p>}
                  </div>
                )}

                {/* --- AUDIT LOGS VIEW --- */}
                {activeTab === "logs" && (
                  <div className="bg-black/40 border border-white/10 rounded-lg overflow-hidden shadow-2xl w-full">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-[#D4AF37]/10 text-[10px] tracking-[0.2em] uppercase text-[#D4AF37]">
                            <th className="p-4 border-b border-[#D4AF37]/20">Timestamp</th>
                            <th className="p-4 border-b border-[#D4AF37]/20">Team</th>
                            <th className="p-4 border-b border-[#D4AF37]/20">Action</th>
                            <th className="p-4 border-b border-[#D4AF37]/20">Clue</th>
                            <th className="p-4 border-b border-[#D4AF37]/20 text-right">Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logs.map((log) => {
                            const isHint = log.action_type === 'HINT_USED';
                            return (
                              <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-xs text-white/80 font-mono">
                                <td className="p-4 text-white/40 whitespace-nowrap">
                                  {new Date(log.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                </td>
                                <td className="p-4 font-sans font-bold text-white whitespace-nowrap">{log.teams?.team_name || "Unknown"}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-[10px] font-sans tracking-widest uppercase whitespace-nowrap ${isHint ? 'bg-yellow-900/30 text-yellow-500' : 'bg-green-900/30 text-green-500'}`}>
                                    {log.action_type}
                                  </span>
                                </td>
                                <td className="p-4 text-white/50">{log.clues?.title || "N/A"}</td>
                                <td className={`p-4 text-right font-bold ${isHint ? 'text-white/30' : 'text-[#D4AF37]'}`}>
                                  +{log.points_awarded}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    {logs.length === 0 && <p className="text-center p-8 text-white/40 text-xs uppercase tracking-widest">No game events recorded yet.</p>}
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}