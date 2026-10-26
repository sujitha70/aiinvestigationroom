import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Sparkles,
  Sliders,
  FileText,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Shield,
  CheckCircle,
} from "lucide-react";
import { casesApi } from "../api";

const PRESET_SCENARIOS = [
  {
    title: "The Vanishing Blue Diamond",
    difficulty: "medium",
    text: "During a private auction at the St. Jude Hotel, a 45-carat blue diamond vanished from a display case fitted with laser motion sensors. Only four people had corridor access badges during the 15-minute window.",
  },
  {
    title: "The Poisoned Chateau Vintage",
    difficulty: "hard",
    text: "At a secluded French vineyard celebration, prominent wine critic Henri Laurent collapsed after tasting a rare 1982 vintage. The bottle was shared by three other guests who remained unharmed, but the decanter had strange chemical residue.",
  },
  {
    title: "The Midnight Server Room Breach",
    difficulty: "easy",
    text: "Encrypted source code for an autonomous drone system was exfiltrated from an air-gapped server vault at 02:14 AM. Security footage shows a shadowy figure bypassing the biometric airlock using an authorized keycard.",
  },
];

export function CreateMystery() {
  const navigate = useNavigate();

  const [premise, setPremise] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState(null);

  const characterCount = premise.trim().length;
  const isTooShort = characterCount < 10 && characterCount > 0;
  const isTooLong = characterCount > 2000;
  const isValid = characterCount >= 10 && characterCount <= 2000;

  const handleApplyPreset = (preset) => {
    setPremise(preset.text);
    setDifficulty(preset.difficulty);
    setError(null);
  };

  const handleClear = () => {
    setPremise("");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      setStatusMessage("Synthesizing suspects, clues, and sealed solution via Gemini...");

      const res = await casesApi.createCase(premise.trim(), difficulty);
      const caseId = res.data.caseId;

      setStatusMessage("Case file created. Opening Investigation Room...");
      setTimeout(() => {
        navigate(`/cases/${caseId}`);
      }, 400);
    } catch (err) {
      console.error("Failed to generate case:", err);
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.details?.join(", ") ||
        err.message ||
        "Failed to generate mystery case.";
      setError(errMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-accent-secondary bg-surface-elevated border border-accent-secondary/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini Detective Case Generator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-noir-text tracking-tight">
          Create an Investigation
        </h1>
        <p className="text-xs sm:text-sm text-noir-muted max-w-xl mx-auto">
          Input your mystery premise or incident seed. The AI will generate a
          logically consistent puzzle with discoverable clues, hints, and a
          predetermined culprit.
        </p>
      </div>

      {/* Quick Inspiration Presets */}
      <div className="bg-surface border border-noir-border rounded-xl p-4 space-y-2.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-noir-muted block">
          ⚡ Quick Incident Presets (Click to Load):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PRESET_SCENARIOS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              disabled={isSubmitting}
              className="text-left p-3 rounded-lg border border-noir-border/70 bg-surface-elevated hover:border-accent-primary hover:bg-surface-hover transition group"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-noir-text group-hover:text-accent-secondary">
                  {preset.title}
                </h4>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-surface border border-noir-border text-noir-muted">
                  {preset.difficulty}
                </span>
              </div>
              <p className="text-[11px] text-noir-muted line-clamp-2 mt-1">
                {preset.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Premise Textarea */}
        <div className="bg-surface border border-noir-border rounded-xl p-5 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="premise-input"
              className="text-xs font-bold text-noir-text uppercase font-mono tracking-wider flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-accent-primary" />
              <span>Incident Premise / Story Seed *</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                isTooShort || isTooLong ? "text-status-error font-bold" : "text-noir-muted"
              }`}
            >
              {characterCount} / 2,000 characters (min 10)
            </span>
          </div>

          <textarea
            id="premise-input"
            rows={5}
            value={premise}
            onChange={(e) => setPremise(e.target.value)}
            disabled={isSubmitting}
            placeholder="A priceless ancient sculpture disappeared from an art collector's penthouse during a thunderstorm. The alarm system was deactivated with an internal admin override..."
            className="w-full bg-surface-elevated border border-noir-border rounded-lg p-3.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-accent-primary leading-relaxed"
          />

          {isTooShort && (
            <p className="text-[11px] text-status-error flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Premise must be at least 10 characters long.
            </p>
          )}
          {isTooLong && (
            <p className="text-[11px] text-status-error flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Premise cannot exceed 2,000 characters.
            </p>
          )}
        </div>

        {/* Difficulty Selection */}
        <div className="bg-surface border border-noir-border rounded-xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-noir-border/50 pb-2">
            <h3 className="text-xs font-bold text-noir-text uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-accent-secondary" />
              <span>Select Difficulty Level</span>
            </h3>
            <span className="text-[11px] text-noir-muted">
              Determines suspect, clue, and hint counts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Easy */}
            <button
              type="button"
              onClick={() => setDifficulty("easy")}
              disabled={isSubmitting}
              className={`p-4 rounded-xl border text-left transition ${
                difficulty === "easy"
                  ? "border-emerald-400 bg-emerald-950/20 shadow-glow"
                  : "border-noir-border bg-surface-elevated hover:border-noir-border/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-emerald-400 text-sm">Easy</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                  100 pts
                </span>
              </div>
              <ul className="text-[11px] text-noir-muted space-y-0.5 mt-2">
                <li>• 3 Suspects</li>
                <li>• 5 Discoverable Clues</li>
                <li>• 2 Strategic Hints</li>
              </ul>
            </button>

            {/* Medium */}
            <button
              type="button"
              onClick={() => setDifficulty("medium")}
              disabled={isSubmitting}
              className={`p-4 rounded-xl border text-left transition ${
                difficulty === "medium"
                  ? "border-accent-secondary bg-cyan-950/20 shadow-cyanGlow"
                  : "border-noir-border bg-surface-elevated hover:border-noir-border/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-accent-secondary text-sm">
                  Medium
                </span>
                <span className="text-[10px] font-mono font-bold text-accent-secondary bg-accent-secondary/10 px-2 py-0.5 rounded">
                  150 pts
                </span>
              </div>
              <ul className="text-[11px] text-noir-muted space-y-0.5 mt-2">
                <li>• 4 Suspects</li>
                <li>• 7 Discoverable Clues</li>
                <li>• 3 Strategic Hints</li>
              </ul>
            </button>

            {/* Hard */}
            <button
              type="button"
              onClick={() => setDifficulty("hard")}
              disabled={isSubmitting}
              className={`p-4 rounded-xl border text-left transition ${
                difficulty === "hard"
                  ? "border-accent-primary bg-purple-950/20 shadow-glow"
                  : "border-noir-border bg-surface-elevated hover:border-noir-border/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-accent-primary text-sm">Hard</span>
                <span className="text-[10px] font-mono font-bold text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded">
                  200 pts
                </span>
              </div>
              <ul className="text-[11px] text-noir-muted space-y-0.5 mt-2">
                <li>• 5 Suspects</li>
                <li>• 9 Discoverable Clues</li>
                <li>• 3 Strategic Hints</li>
              </ul>
            </button>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-xl bg-status-error/10 border border-status-error/40 text-status-error text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Case Generation Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isSubmitting && (
          <div className="bg-surface-elevated border border-accent-primary/40 rounded-xl p-5 text-center space-y-3 animate-in fade-in">
            <div className="w-8 h-8 rounded-full border-2 border-accent-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-bold text-noir-text font-mono">
              {statusMessage}
            </p>
            <p className="text-[11px] text-noir-muted">
              Generating suspects, clues, hints, and locking the answer key.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleClear}
              disabled={isSubmitting || characterCount === 0}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-noir-border text-xs text-noir-muted hover:text-noir-text hover:bg-surface transition disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Form</span>
            </button>
            <Link
              to="/"
              className="flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-lg border border-noir-border text-xs text-noir-muted hover:text-noir-text hover:bg-surface transition"
            >
              Cancel
            </Link>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-accent-primary hover:bg-accent-hover text-white text-xs font-bold transition shadow-glow disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Mystery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
