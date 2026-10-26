import React from "react";
import { Link } from "react-router-dom";
import { Shield, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-noir-border/50 bg-surface/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-surface-elevated border border-noir-border text-accent-secondary">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-noir-text">
                AI Mystery Room — Interactive Case Solver
              </p>
              <p className="text-xs text-noir-muted">
                Built with React, Vite, Express, MongoDB, and Google Gemini API.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-noir-muted">
            <Link to="/" className="hover:text-noir-text transition">
              Home
            </Link>
            <Link to="/create" className="hover:text-noir-text transition">
              Create Mystery
            </Link>
            <a
              href="https://bit.ly/ai-mystery-room-sub-form"
              target="_blank"
              rel="noreferrer"
              className="text-accent-secondary hover:underline"
            >
              Submission Form
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-noir-border/30 flex flex-col sm:flex-row items-center justify-between text-[11px] text-noir-muted gap-4">
          <p>© {new Date().getFullYear()} AI Mystery Room. All cases, suspects, and clues are entirely fictional.</p>
          <div className="flex items-center gap-1.5 text-accent-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Predetermined Solution Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
