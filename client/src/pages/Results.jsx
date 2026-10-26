import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Award,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Clock,
  Home,
  PlusCircle,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { casesApi } from "../api";

export function Results() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResult() {
      try {
        setLoading(true);
        const res = await casesApi.getResult(id);
        setResult(res.data);
      } catch (err) {
        console.error("Failed to fetch result:", err);
        setError(err.response?.data?.error || "Unable to retrieve case results.");
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-accent-primary border-t-transparent animate-spin mx-auto" />
        <h2 className="text-lg font-bold text-noir-text">
          Unsealing Case Solution...
        </h2>
        <p className="text-xs text-noir-muted">
          Evaluating your deduction against the canonical answer key.
        </p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-status-error/10 border border-status-error/40 text-status-error flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-noir-text">Solution Sealed</h2>
        <p className="text-xs text-noir-muted">{error}</p>
        <Link
          to={`/cases/${id}`}
          className="inline-block px-4 py-2 rounded-lg bg-accent-primary text-white text-xs font-semibold hover:bg-accent-hover transition"
        >
          Return to Investigation
        </Link>
      </div>
    );
  }

  const { correct, finalScore, selectedSuspect, solution } = result;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Verdict Banner */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl ${
          correct
            ? "border-status-success/50 bg-status-success/10"
            : "border-status-error/50 bg-status-error/10"
        }`}
      >
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest bg-surface/80 border border-noir-border">
            {correct ? (
              <span className="text-status-success flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Deduction Verified
              </span>
            ) : (
              <span className="text-status-error flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Accusation Disproven
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-noir-text">
            {correct ? "CASE SOLVED!" : "INVESTIGATION FAILED"}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
            {correct
              ? "Brilliant deduction! You spotted the contradictions, evaluated the physical evidence, and accurately unmasked the true perpetrator."
              : `You accused ${selectedSuspect?.name}. Although their actions were suspicious, physical evidence clears them of the crime.`}
          </p>

          {/* Final Score */}
          <div className="pt-4 flex justify-center">
            <div className="bg-surface/90 border border-noir-border px-8 py-3 rounded-2xl shadow-card">
              <span className="text-[10px] uppercase font-mono tracking-wider text-noir-muted block">
                Final Investigator Score
              </span>
              <span className="text-4xl font-black text-noir-text font-mono">
                {finalScore} <span className="text-sm font-normal text-noir-muted">pts</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Culprit & Suspect Reveal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Culprit Card */}
        <div className="bg-surface border border-noir-border rounded-xl p-5 shadow-card space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-status-error block font-bold">
            Guilty Perpetrator Unmasked
          </span>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-status-error/20 border border-status-error text-status-error flex items-center justify-center font-bold text-lg">
              {solution.culpritName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-noir-text">
                {solution.culpritName}
              </h3>
              <p className="text-xs text-status-error font-medium">
                Confirmed Culprit
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-noir-border/50">
            <span className="text-[11px] font-semibold text-neutral-400 block mb-1">
              Hidden Real Motive:
            </span>
            <p className="text-xs text-neutral-200 leading-relaxed bg-surface-elevated p-3 rounded-lg border border-noir-border/60">
              {solution.motive}
            </p>
          </div>
        </div>

        {/* Selected Suspect Card */}
        <div className="bg-surface border border-noir-border rounded-xl p-5 shadow-card space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent-secondary block font-bold">
            Your Accusation
          </span>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-elevated border border-noir-border text-noir-text flex items-center justify-center font-bold text-lg">
              {selectedSuspect ? selectedSuspect.name.charAt(0) : "S"}
            </div>
            <div>
              <h3 className="text-lg font-bold text-noir-text">
                {selectedSuspect ? selectedSuspect.name : "Unknown"}
              </h3>
              <p className="text-xs text-noir-muted">
                {correct ? "Correct target" : "Innocent suspect targeted"}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-noir-border/50">
            <span className="text-[11px] font-semibold text-neutral-400 block mb-1">
              Verdict Analysis:
            </span>
            <p className="text-xs text-neutral-200 leading-relaxed bg-surface-elevated p-3 rounded-lg border border-noir-border/60">
              {correct
                ? "Your reasoning was airtight. All decisive clues connected this suspect to the crime."
                : `You selected ${selectedSuspect?.name}. You were deceived by red herrings; see the detective breakdown below.`}
            </p>
          </div>
        </div>
      </div>

      {/* Detective Solution Breakdown */}
      <div className="bg-surface border border-noir-border rounded-xl p-6 shadow-card space-y-4">
        <div className="flex items-center gap-2 text-accent-primary">
          <Lightbulb className="w-5 h-5" />
          <h2 className="text-base font-bold text-noir-text uppercase tracking-wide">
            Detective Deduction Breakdown
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed bg-surface-elevated p-4 rounded-xl border border-noir-border">
          {solution.explanation}
        </p>
      </div>

      {/* Reconstructed Crime Timeline */}
      {solution.timeline && solution.timeline.length > 0 && (
        <div className="bg-surface border border-noir-border rounded-xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2 text-accent-secondary">
            <Clock className="w-5 h-5" />
            <h2 className="text-base font-bold text-noir-text uppercase tracking-wide">
              Reconstructed Crime Timeline
            </h2>
          </div>
          <div className="space-y-3 pt-2">
            {solution.timeline.map((item, idx) => (
              <div
                key={idx}
                className="relative pl-5 border-l-2 border-accent-secondary/50 text-xs space-y-1"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-accent-secondary absolute -left-[6px] top-1" />
                <span className="font-mono text-[11px] font-bold text-accent-secondary">
                  {item.time}
                </span>
                <p className="text-neutral-200">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-noir-border/60">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs text-noir-muted hover:text-noir-text transition"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <Link
          to="/create"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-xs font-bold transition shadow-glow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Solve Another Mystery</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
