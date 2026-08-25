"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { supabase } from "@/utils/supabase";

export default function AboutPage() {
  // Form State
  const [teamName, setTeamName] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [memberCount, setMemberCount] = useState("1"); // Default to 1 (Individual)
  const [college, setCollege] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("1st Year");
  
  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [generatedPasscode, setGeneratedPasscode] = useState("");

  // Simple function to generate a 6-character alphanumeric passcode
  const generatePasscode = () => {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const newPasscode = generatePasscode();

    try {
      // Send data to Supabase including the new fields
      const { error } = await supabase
        .from('teams')
        .insert([
          { 
            team_name: teamName, 
            captain_email: captainEmail, 
            member_count: parseInt(memberCount),
            college: college,
            year_of_study: yearOfStudy,
            passcode: newPasscode
          }
        ]);

      if (error) throw error;

      // If successful, save the passcode to show the user
      setGeneratedPasscode(newPasscode);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Error inserting data:", error.message);
      setErrorMsg("Failed to register team. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D2B1D] bg-[url('/BG.png')] bg-cover bg-center bg-fixed text-[#FDFBF7] font-sans">
      
      {/* Cinematic Dark Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0D2B1D]/90 via-black/80 to-[#0D2B1D]/95 z-0 pointer-events-none"></div>

      <div className="relative z-50">
        <Navbar />
      </div>

      <section className="relative z-10 pt-32 pb-20 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        
        {/* --- LEFT SIDE: ABOUT CONTENT --- */}
        <div className="w-full lg:w-5/12 flex flex-col animate-float" style={{ animationDuration: '5s' }}>
          
          <div className="flex items-center gap-4 mb-4 text-[#F3E5AB]">
            <span className="text-sm">✧</span>
            <span className="font-sans text-[10px] md:text-[11px] tracking-[0.3em] font-bold uppercase drop-shadow-md">FOSS Club Presents</span>
          </div>
          
          <h1 className="font-[family-name:var(--font-cinzel-decorative)] text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#D4AF37] to-[#8C6216] font-bold mb-6 lg:mb-8 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] leading-tight">
            Mahabali: Lost on the Open Web
          </h1>
          
          <div className="space-y-4 lg:space-y-6 font-sans text-xs md:text-sm lg:text-base text-[#FDFBF7]/80 tracking-widest leading-loose drop-shadow-md">
            <p>
              Onam is here... but King Mahabali has vanished!
            </p>
            <p>
              Join us for an exciting online mystery hunt where teams race through the open web, following a trail of hidden clues across Wikimedia, OpenStreetMap, digital archives, and FOSS-based puzzles.
            </p>
            
            {/* UPDATED EVENT DETAILS BOX WITH ELEGANT SVG ICONS */}
            <div className="border-l-2 border-[#D4AF37] pl-4 md:pl-6 py-2 mt-6 lg:mt-8 bg-[#D4AF37]/5 space-y-4">
              <p className="text-[#D4AF37] font-bold text-xs md:text-sm tracking-[0.2em] uppercase">Event Details</p>
              
              <ul className="space-y-3 text-[10px] md:text-xs tracking-wider">
                {/* Date */}
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  <span><span className="text-white/50">DATE:</span> 28 August 2026</span>
                </li>
                {/* Time */}
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span><span className="text-white/50">TIME:</span> 7:30 PM – 8:30 PM (Online)</span>
                </li>
                {/* Team Size */}
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                  <span><span className="text-white/50">TEAM SIZE:</span> Individual or max 3 members</span>
                </li>
                {/* Fee */}
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span><span className="text-white/50">FEE:</span> ₹ 10 per individual</span>
                </li>
                {/* Certificates */}
                <li className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span><span className="text-white/50">PERKS:</span> Certificates provided to all participants</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-[#D4AF37]/20 mt-3">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.29 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                  </svg>
                  <p className="text-[#D4AF37] font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase">Prize Pool</p>
                </div>
                <div className="flex flex-col gap-2 text-[10px] md:text-xs font-bold pl-1">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-[#FFF0B3]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
                    <span className="text-[#FFF0B3]">1st Prize: ₹ 200</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-[#C0C0C0]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
                    <span className="text-[#C0C0C0]">2nd Prize: ₹ 100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: REGISTRATION FORM --- */}
        <div className="w-full lg:w-7/12 bg-black/40 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-6 md:p-10 lg:p-12 mt-4 lg:mt-0">
          
          {!isSubmitted ? (
            <>
              <h2 className="font-serif text-2xl md:text-3xl text-[#FDFBF7] mb-2 drop-shadow-md">
                Register Your Team
              </h2>
              <p className="font-sans text-[9px] md:text-[10px] text-white/50 tracking-[0.2em] uppercase mb-8">
                Secure your spot in the hunt
              </p>

              {errorMsg && (
                <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-bold text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  {/* Team Name */}
                  <div className="flex flex-col">
                    <label className="font-sans text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-2 ml-1">Team Name (or Your Name)</label>
                    <input required type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g. Asura's Legacy" className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-sm text-[#FDFBF7] font-sans tracking-widest placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-colors" />
                  </div>

                  {/* Captain Email */}
                  <div className="flex flex-col">
                    <label className="font-sans text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-2 ml-1">Contact Email</label>
                    <input required type="email" value={captainEmail} onChange={(e) => setCaptainEmail(e.target.value)} placeholder="email@college.edu" className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-sm text-[#FDFBF7] font-sans tracking-widest placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  {/* College */}
                  <div className="flex flex-col">
                    <label className="font-sans text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-2 ml-1">College / Institution</label>
                    <input required type="text" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Your College Name" className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-sm text-[#FDFBF7] font-sans tracking-widest placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-colors" />
                  </div>

                  {/* Year of Study */}
                  <div className="flex flex-col">
                    <label className="font-sans text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-2 ml-1">Year of Study</label>
                    <select value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)} className="w-full bg-[#111] border border-white/20 rounded px-4 py-3 text-sm text-[#FDFBF7] font-sans tracking-widest focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none">
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Other">Other / Alum</option>
                    </select>
                  </div>
                </div>

                {/* Number of Members - UPDATED FOR MAX 3 */}
                <div className="flex flex-col">
                  <label className="font-sans text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-2 ml-1">Total Team Size</label>
                  <select value={memberCount} onChange={(e) => setMemberCount(e.target.value)} className="w-full bg-[#111] border border-white/20 rounded px-4 py-3 text-sm text-[#FDFBF7] font-sans tracking-widest focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none">
                    <option value="1">Individual (1 Member)</option>
                    <option value="2">2 Members</option>
                    <option value="3">3 Members (Maximum)</option>
                  </select>
                  <p className="mt-2 ml-1 text-[9px] text-white/40 tracking-widest">* ₹ 10 registration fee applies per individual.</p>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={isSubmitting} className={`mt-4 w-full md:w-auto self-center group relative p-[2px] clip-game-button bg-gradient-to-b from-[#FFF0B3] to-[#8C6216] shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'btn-hover-effect animate-heartbeat'}`}>
                  <div className="clip-game-button bg-premium-gold px-12 py-3.5 md:py-4 flex items-center justify-center gap-3">
                    <span className="font-sans font-extrabold tracking-[0.1em] md:tracking-[0.2em] text-[11px] md:text-[13px] uppercase text-[#2B1B04]">
                      {isSubmitting ? "Registering..." : "Confirm Registration"}
                    </span>
                  </div>
                </button>

              </form>
            </>
          ) : (
            // --- VIP SUCCESS SCREEN WITH PASSCODE ---
            <div className="h-full flex flex-col items-center justify-center text-center py-10 md:py-16 animate-fade-in">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#D4AF37] mb-4">Registration Complete</h2>
              <p className="font-sans text-xs md:text-sm text-[#FDFBF7]/70 tracking-widest leading-loose mb-8">
                Welcome to the hunt, <strong>{teamName}</strong>. Save your secure team passcode below. You will need it to enter the game portal on August 28th.
              </p>
              
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37] p-6 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.2)] w-full max-w-sm">
                <p className="text-[10px] text-[#D4AF37] tracking-[0.3em] uppercase mb-2">Team Passcode</p>
                <p className="font-mono text-3xl md:text-4xl font-bold tracking-[0.2em] text-[#FDFBF7] drop-shadow-md">
                  {generatedPasscode}
                </p>
              </div>
              
              <p className="mt-8 text-[10px] md:text-xs text-red-400/80 tracking-widest uppercase font-bold max-w-xs mx-auto">
                ⚠️ Do not lose this code. You cannot recover it.
              </p>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}