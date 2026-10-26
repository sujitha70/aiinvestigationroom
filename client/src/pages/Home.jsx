import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Search,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  Award,
  ArrowRight,
  FileQuestion,
  Users,
  Lightbulb,
  Lock,
} from "lucide-react";

export function Home() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-accent-secondary bg-surface-elevated border border-accent-secondary/30 mb-6 shadow-cyanGlow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive AI Investigation Room</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-noir-text tracking-tight max-w-4xl mx-auto leading-tight">
          Every Crime Leaves a Trail.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-accent-secondary to-status-success">
            Can You Deduce the Truth?
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base text-noir-muted max-w-2xl mx-auto leading-relaxed">
          Input any scenario or crime seed. Google Gemini constructs a complete,
          logically consistent fictional case file with suspects, hidden alibis,
          discoverable clues, and a sealed answer key.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/create"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-sm font-bold shadow-glow transition group"
          >
            <span>Create a Mystery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#rules"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface border border-noir-border text-xs text-neutral-300 hover:text-white hover:bg-surface-hover transition"
          >
            <HelpCircle className="w-4 h-4 text-accent-secondary" />
            <span>Rules & Scoring Table</span>
          </a>
        </div>

        {/* Quick Sample Preview Bar */}
        <div className="mt-10 p-4 rounded-xl bg-surface/60 border border-noir-border/70 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent-secondary font-bold">
              ★ Active Case File
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-noir-text">
              The Mystery of the St. Jude Blue Diamond
            </h4>
            <p className="text-[11px] text-noir-muted">
              4 Suspects • 7 Discoverable Clues • 3 Hints • Medium Difficulty
            </p>
          </div>
          <Link
            to="/create"
            className="px-4 py-2 rounded-lg bg-surface-elevated hover:bg-surface border border-accent-secondary/40 text-xs font-semibold text-accent-secondary hover:text-white transition shrink-0"
          >
            Start Case →
          </Link>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-surface border border-noir-border glow-card space-y-3">
            <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-accent-primary/40 flex items-center justify-center text-accent-primary">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-noir-text">
              Predetermined Solution
            </h3>
            <p className="text-xs text-noir-muted leading-relaxed">
              The AI never changes the culprit mid-game. The solution and timeline
              are locked server-side before you investigate.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-noir-border glow-card space-y-3">
            <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-accent-secondary/40 flex items-center justify-center text-accent-secondary">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-noir-text">
              Interactive Clue Discovery
            </h3>
            <p className="text-xs text-noir-muted leading-relaxed">
              Examine physical evidence, forensics, and alibi conflicts. Each
              clue you discover adds +5 points to your investigator rating.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-noir-border glow-card space-y-3">
            <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-noir-text">
              Strategic Hints & Accusation
            </h3>
            <p className="text-xs text-noir-muted leading-relaxed">
              Stuck on a contradiction? Request a hint for a -10 point penalty,
              then accuse the true culprit to claim up to 200 points.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface/50 border border-noir-border rounded-2xl p-6 sm:p-10 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-accent-secondary">
              Investigation Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-noir-text">
              How the Mystery Room Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface border border-noir-border rounded-xl p-5 space-y-2 relative">
              <div className="font-mono text-xs font-bold text-accent-primary">
                STEP 01
              </div>
              <h4 className="text-sm font-bold text-noir-text">
                Enter Premise & Difficulty
              </h4>
              <p className="text-xs text-noir-muted">
                Type an incident idea or choose from curated presets across Easy,
                Medium, or Hard.
              </p>
            </div>

            <div className="bg-surface border border-noir-border rounded-xl p-5 space-y-2 relative">
              <div className="font-mono text-xs font-bold text-accent-secondary">
                STEP 02
              </div>
              <h4 className="text-sm font-bold text-noir-text">
                Gemini Synthesizes Case
              </h4>
              <p className="text-xs text-noir-muted">
                The AI structures suspects with public motives, discoverable
                clues, and a secret canonical answer key.
              </p>
            </div>

            <div className="bg-surface border border-noir-border rounded-xl p-5 space-y-2 relative">
              <div className="font-mono text-xs font-bold text-amber-400">
                STEP 03
              </div>
              <h4 className="text-sm font-bold text-noir-text">
                Investigate & Discover
              </h4>
              <p className="text-xs text-noir-muted">
                Uncover clues (+5 pts), evaluate alibis, spot contradictions, and
                request strategic hints if necessary.
              </p>
            </div>

            <div className="bg-surface border border-noir-border rounded-xl p-5 space-y-2 relative">
              <div className="font-mono text-xs font-bold text-status-success">
                STEP 04
              </div>
              <h4 className="text-sm font-bold text-noir-text">
                Accuse & Reveal Solution
              </h4>
              <p className="text-xs text-noir-muted">
                Submit your final suspect. The backend scores your deduction and
                explains the complete timeline breakdown.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rules & Difficulty Table */}
      <section id="rules" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface border border-noir-border rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-noir-border/70 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-accent-secondary">
                Official Scoring Matrix
              </span>
              <h3 className="text-xl font-bold text-noir-text">
                Difficulty Levels & Point Rules
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-status-success bg-status-success/10 px-3 py-1.5 rounded-lg border border-status-success/30">
              <Award className="w-4 h-4" />
              <span>Min Score: 0 (No Negatives)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-noir-border text-noir-muted font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Suspects</th>
                  <th className="py-3 px-4">Clues</th>
                  <th className="py-3 px-4">Hints</th>
                  <th className="py-3 px-4 text-right">Correct Accusation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-noir-border/50 text-neutral-200">
                <tr className="hover:bg-surface-elevated/40">
                  <td className="py-3 px-4 font-bold text-emerald-400">Easy</td>
                  <td className="py-3 px-4">3 Suspects</td>
                  <td className="py-3 px-4">5 Clues</td>
                  <td className="py-3 px-4">2 Hints</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    +100 pts
                  </td>
                </tr>
                <tr className="hover:bg-surface-elevated/40">
                  <td className="py-3 px-4 font-bold text-accent-secondary">
                    Medium
                  </td>
                  <td className="py-3 px-4">4 Suspects</td>
                  <td className="py-3 px-4">7 Clues</td>
                  <td className="py-3 px-4">3 Hints</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-accent-secondary">
                    +150 pts
                  </td>
                </tr>
                <tr className="hover:bg-surface-elevated/40">
                  <td className="py-3 px-4 font-bold text-accent-primary">Hard</td>
                  <td className="py-3 px-4">5 Suspects</td>
                  <td className="py-3 px-4">9 Clues</td>
                  <td className="py-3 px-4">3 Hints</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-accent-primary">
                    +200 pts
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="bg-surface-elevated p-3.5 rounded-xl border border-noir-border/70">
              <span className="font-bold text-status-success block mb-0.5">
                +5 Points Per Discovered Clue
              </span>
              <p className="text-noir-muted text-[11px]">
                Investigate and reveal hidden clue descriptions to accumulate
                extra points before accusing.
              </p>
            </div>
            <div className="bg-surface-elevated p-3.5 rounded-xl border border-noir-border/70">
              <span className="font-bold text-amber-400 block mb-0.5">
                -10 Points Per Requested Hint
              </span>
              <p className="text-noir-muted text-[11px]">
                Unlock hints if you are uncertain of the suspect, balancing the
                point cost against accuracy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
