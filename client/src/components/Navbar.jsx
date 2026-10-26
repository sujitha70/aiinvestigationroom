import React from "react";
import { Link } from "react-router-dom";
import { Search, PlusCircle, HelpCircle, Shield } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-noir-border/70 bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-accent-primary/40 flex items-center justify-center text-accent-primary group-hover:border-accent-primary group-hover:shadow-glow transition-all">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold tracking-wider text-noir-text text-lg flex items-center gap-1.5">
              AI MYSTERY <span className="text-accent-primary">ROOM</span>
            </span>
            <span className="block text-[10px] uppercase font-mono tracking-widest text-noir-muted -mt-1">
              Gemini Detective Unit
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/#rules"
            className="hidden sm:flex items-center gap-1.5 text-xs text-noir-muted hover:text-noir-text px-3 py-1.5 rounded-md hover:bg-surface transition"
          >
            <HelpCircle className="w-4 h-4" />
            Rules & Scoring
          </Link>
          <Link
            to="/create"
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-accent-primary hover:bg-accent-hover text-white shadow-glow transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Mystery</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
