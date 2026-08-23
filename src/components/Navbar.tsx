"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "How to Play", href: "/how-to-play" },
  { name: "Timeline", href: "/timeline" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-700 bg-transparent py-6">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif tracking-widest text-lg md:text-xl font-bold text-[#FDFBF7] group-hover:text-[#D4AF37] transition-colors duration-500 drop-shadow-md">
            FOSS CLUB
          </span>
        </Link>

        {/* Desktop Navigation Links (Now Bolder with Drop Shadow) */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-sans font-semibold tracking-wider text-[#FDFBF7] hover:text-[#D4AF37] transition-colors duration-300 drop-shadow-md"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center">
          <Link
            href="/about"
            className="px-6 py-2.5 text-xs tracking-widest font-bold uppercase rounded transition-all duration-300 border text-[#0D2B1D] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]"
          >
            Register Team
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden focus:outline-none p-2 text-[#FDFBF7] drop-shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0D2B1D]/95 border-b border-[#D4AF37]/30 px-6 py-6 space-y-4 backdrop-blur-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold tracking-wide text-[#FDFBF7] hover:text-[#D4AF37]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="#register"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center w-full py-2.5 text-xs tracking-widest font-bold uppercase text-[#0D2B1D] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] rounded-md"
            >
              Register Team
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}