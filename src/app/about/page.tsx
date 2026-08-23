"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { supabase } from "@/utils/supabase";

export default function AboutPage() {
  // Form State
  const [teamName, setTeamName] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [memberCount, setMemberCount] = useState("2");
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
          
          <h1 className="font-[family-name:var(--font-cinzel-decorative)] text-4xl md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF0B3] via-[#D4AF37] to-[#8C6216] font-bold mb-6 lg:mb-8 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]">
            Mahabali: Lost on the Open Web
          </h1>
          
          <div className="space-y-4 lg:space-y-6 font-sans text-xs md:text-sm lg:text-base text-[#FDFBF7]/80 tracking-widest leading-loose drop-shadow-md">
            <p>
              Every Onam, the legendary King Mahabali returns to visit his people. But this year, he has lost his way in the vast, uncharted territories of the Open Web.
            </p>
            <p>
              Hosted by the <strong className="text-[#D4AF37]">Free and Open Source Software (FOSS) Club</strong>, this unique mystery hunt challenges you to use open-source tools, open datasets, and your investigative skills to track him down.
            </p>
            <div className="border-l-2 border-[#D4AF37] pl-4 md:pl-6 py-2 mt-6 lg:mt-8 bg-[#D4AF37]/5">
              <p className="text-[#D4AF37] font-bold mb-1 text-xs md:text-sm">EVENT DETAILS</p>
              <ul className="space-y-2 text-[10px] md:text-xs">
                <li><span className="text-white/50">TEAM SIZE:</span> 2 to 4 Members</li>
                <li><span className="text-white/50">PLATFORM:</span> Online (Open Web)</li>
                <li><span className="text-white/50">REQUIREMENTS:</span> A browser, curiosity, and wit.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: REGISTRATION FORM --- */}
        <div className="w-full lg:w-7/12 bg-black/40 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-6 md:p-10 lg:p-12">
          
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
                    <label className="font-sans text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-2 ml-1">Team Name</label>
                    <input required type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g. Asura's Legacy" className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-sm text-[#FDFBF7] font-sans tracking-widest placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-colors" />
                  </div>

                  {/* Captain Email */}
                  <div className="flex flex-col">
                    <label className="font-sans text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-2 ml-1">Captain's Email</label>
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

                {/* Number of Members */}
                <div className="flex flex-col">
                  <label className="font-sans text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] mb-2 ml-1">Total Team Size</label>
                  <select value={memberCount} onChange={(e) => setMemberCount(e.target.value)} className="w-full bg-[#111] border border-white/20 rounded px-4 py-3 text-sm text-[#FDFBF7] font-sans tracking-widest focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none">
                    <option value="2">2 Members</option>
                    <option value="3">3 Members</option>
                    <option value="4">4 Members</option>
                  </select>
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
                Welcome to the hunt, <strong>{teamName}</strong>. Save your secure team passcode below. You will need it to enter the game portal.
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