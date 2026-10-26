import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FileText,
  User,
  Search,
  Lightbulb,
  Award,
  AlertCircle,
  CheckCircle,
  Eye,
  Lock,
  Unlock,
  AlertOctagon,
  X,
  Check,
  RotateCcw,
} from "lucide-react";
import { casesApi } from "../api";

export function InvestigationRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clue discovery & Hint action states
  const [discoveringClueId, setDiscoveringClueId] = useState(null);
  const [requestingHint, setRequestingHint] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  // Accusation modal
  const [isAccusationOpen, setIsAccusationOpen] = useState(false);
  const [selectedSuspectId, setSelectedSuspectId] = useState("");
  const [confirmedWarning, setConfirmedWarning] = useState(false);
  const [isSubmittingAccusation, setIsSubmittingAccusation] = useState(false);

  useEffect(() => {
    async function fetchCase() {
      try {
        setLoading(true);
        const res = await casesApi.getCase(id);
        setCaseData(res.data);

        // If case is already completed, go to results
        if (res.data.isCompleted) {
          navigate(`/cases/${id}/result`);
        }
      } catch (err) {
        console.error("Failed to fetch case:", err);
        setError(err.response?.data?.error || "Unable to locate case record.");
      } finally {
        setLoading(false);
      }
    }
    fetchCase();
  }, [id, navigate]);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Discover Clue
  const handleDiscoverClue = async (clueId) => {
    try {
      setDiscoveringClueId(clueId);
      const res = await casesApi.discoverClue(id, clueId);

      // Update local state
      setCaseData((prev) => {
        if (!prev) return prev;
        const updatedClues = prev.clues.map((c) =>
          c.id === clueId
            ? {
                ...c,
                discovered: true,
                description: res.data.description,
                relevance: res.data.relevance,
              }
            : c
        );
        return {
          ...prev,
          clues: updatedClues,
          playerScore: res.data.totalScore,
          discoveredClueCount: prev.discoveredClueCount + 1,
        };
      });

      showNotice(`Clue discovered! +5 points added.`);
    } catch (err) {
      console.error("Failed to discover clue:", err);
      alert(err.response?.data?.error || "Error discovering clue.");
    } finally {
      setDiscoveringClueId(null);
    }
  };

  // Request Hint
  const handleRequestHint = async () => {
    try {
      setRequestingHint(true);
      const res = await casesApi.requestHint(id);

      // Update local state
      setCaseData((prev) => {
        if (!prev) return prev;
        const updatedHints = prev.hints.map((h) =>
          h.id === res.data.hintId
            ? { ...h, unlocked: true, text: res.data.text }
            : h
        );
        return {
          ...prev,
          hints: updatedHints,
          playerScore: res.data.totalScore,
          unlockedHintCount: res.data.unlockedHintCount,
        };
      });

      showNotice(`Hint unlocked! -10 points deducted.`);
    } catch (err) {
      console.error("Failed to unlock hint:", err);
      alert(err.response?.data?.error || "Error unlocking hint.");
    } finally {
      setRequestingHint(false);
    }
  };

  // Submit Final Accusation
  const handleAccusationSubmit = async () => {
    if (!selectedSuspectId || !confirmedWarning || isSubmittingAccusation) return;

    try {
      setIsSubmittingAccusation(true);
      const res = await casesApi.submitAccusation(id, selectedSuspectId);
      navigate(`/cases/${id}/result`);
    } catch (err) {
      console.error("Failed to submit accusation:", err);
      alert(err.response?.data?.error || "Accusation submission failed.");
      setIsSubmittingAccusation(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-accent-primary border-t-transparent animate-spin mx-auto" />
        <h2 className="text-lg font-bold text-noir-text">
          Accessing Case File Vault...
        </h2>
        <p className="text-xs text-noir-muted">Decrypting evidence logs and suspect records.</p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-status-error/10 border border-status-error/40 text-status-error flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-noir-text">Case File Unavailable</h2>
        <p className="text-xs text-noir-muted">{error}</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 rounded-lg bg-surface border border-noir-border text-xs text-noir-text hover:bg-surface-hover"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const allHintsUnlocked = caseData.hints.every((h) => h.unlocked);
  const totalClues = caseData.clues.length;
  const discoveredCount = caseData.clues.filter((c) => c.discovered).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {actionNotice && (
        <div className="fixed top-20 right-6 z-50 bg-surface-elevated border border-accent-primary px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold text-white animate-in slide-in-from-top-2">
          {actionNotice}
        </div>
      )}

      {/* Case Header Briefing Bar */}
      <div className="bg-surface border border-noir-border rounded-xl p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-surface-elevated border border-noir-border text-noir-muted">
                Case ID: {caseData.id}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
                Difficulty: {caseData.difficulty}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-noir-text">
              {caseData.title}
            </h1>
            <p className="text-xs sm:text-sm text-noir-muted leading-relaxed">
              {caseData.story}
            </p>
          </div>

          {/* Score & Accuse Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-surface-elevated border border-noir-border px-4 py-2 rounded-lg text-right">
              <span className="text-[10px] text-noir-muted font-mono uppercase block">
                Investigator Score
              </span>
              <span className="text-xl font-black text-noir-text font-mono">
                {caseData.playerScore}{" "}
                <span className="text-xs font-normal text-noir-muted">pts</span>
              </span>
            </div>

            <button
              onClick={() => setIsAccusationOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-status-error hover:bg-red-600 text-white text-xs font-bold transition shadow-lg shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>Make Accusation</span>
            </button>
          </div>
        </div>

        {/* Progress Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-noir-border/50 text-xs font-mono">
          <div className="bg-surface-elevated p-2 rounded-lg border border-noir-border/40">
            <span className="text-[10px] text-noir-muted block uppercase">Clues Discovered:</span>
            <span className="text-sm font-bold text-accent-secondary">
              {discoveredCount} / {totalClues}
            </span>
          </div>
          <div className="bg-surface-elevated p-2 rounded-lg border border-noir-border/40">
            <span className="text-[10px] text-noir-muted block uppercase">Hints Unlocked:</span>
            <span className="text-sm font-bold text-amber-400">
              {caseData.unlockedHintCount || 0} / {caseData.hints.length}
            </span>
          </div>
          <div className="bg-surface-elevated p-2 rounded-lg border border-noir-border/40">
            <span className="text-[10px] text-noir-muted block uppercase">Clue Bonus:</span>
            <span className="text-sm font-bold text-status-success">
              +{discoveredCount * 5} pts
            </span>
          </div>
          <div className="bg-surface-elevated p-2 rounded-lg border border-noir-border/40">
            <span className="text-[10px] text-noir-muted block uppercase">Hint Penalty:</span>
            <span className="text-sm font-bold text-status-error">
              -{(caseData.unlockedHintCount || 0) * 10} pts
            </span>
          </div>
        </div>
      </div>

      {/* Suspects Dossier */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-noir-border/60 pb-2">
          <h2 className="text-sm font-bold text-noir-text uppercase font-mono tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-accent-secondary" />
            <span>Suspect Dossiers ({caseData.suspects.length})</span>
          </h2>
          <span className="text-[11px] text-noir-muted">
            Inspect their claimed alibis and tensions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {caseData.suspects.map((suspect) => (
            <div
              key={suspect.id}
              className="p-4 rounded-xl border border-noir-border bg-surface glow-card space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-elevated border border-noir-border flex items-center justify-center font-bold text-accent-secondary">
                  {suspect.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-noir-text">
                    {suspect.name}
                  </h4>
                  <span className="text-[11px] text-accent-secondary font-medium">
                    {suspect.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-surface-elevated/60 p-2.5 rounded-lg border border-noir-border/40">
                  <span className="text-[10px] font-mono uppercase text-amber-400 block mb-0.5">
                    Public Motive
                  </span>
                  <p className="text-neutral-300 leading-relaxed">
                    {suspect.publicMotive}
                  </p>
                </div>
                <div className="bg-surface-elevated/60 p-2.5 rounded-lg border border-noir-border/40">
                  <span className="text-[10px] font-mono uppercase text-accent-secondary block mb-0.5">
                    Claimed Alibi
                  </span>
                  <p className="text-neutral-300 leading-relaxed">
                    {suspect.alibi}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Discoverable Clues Board */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-noir-border/60 pb-2">
          <h2 className="text-sm font-bold text-noir-text uppercase font-mono tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-status-success" />
            <span>Investigation Clue Board ({totalClues})</span>
          </h2>
          <span className="text-[11px] text-status-success font-mono">
            +5 Points per Discovered Clue
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {caseData.clues.map((clue) => (
            <div
              key={clue.id}
              className={`p-4 rounded-xl border transition-all ${
                clue.discovered
                  ? "border-noir-border/80 bg-surface/90"
                  : "border-accent-primary/40 bg-surface-elevated/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-noir-muted">
                    {clue.id}
                  </span>
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded ${
                      clue.discovered
                        ? "bg-status-success/10 text-status-success border border-status-success/30"
                        : "bg-surface border border-noir-border text-noir-muted"
                    }`}
                  >
                    {clue.discovered ? "Discovered" : "Locked Clue"}
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-noir-text mb-2">
                {clue.title}
              </h4>

              {clue.discovered ? (
                <div className="space-y-2 text-xs">
                  <p className="text-neutral-200 leading-relaxed bg-surface-elevated p-2.5 rounded-lg border border-noir-border/50">
                    {clue.description}
                  </p>
                  {clue.relevance && (
                    <p className="text-[11px] text-noir-muted italic">
                      Relevance: {clue.relevance}
                    </p>
                  )}
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    onClick={() => handleDiscoverClue(clue.id)}
                    disabled={discoveringClueId === clue.id}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-surface hover:bg-accent-primary hover:text-white border border-noir-border text-xs font-semibold text-accent-secondary transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>
                      {discoveringClueId === clue.id
                        ? "Examining..."
                        : "Discover Clue (+5 pts)"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Strategic Hints Terminal */}
      <section className="bg-surface border border-noir-border rounded-xl p-5 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-noir-border/50 pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-noir-text uppercase font-mono">
                Strategic Hints System
              </h3>
              <p className="text-[11px] text-noir-muted">
                Each requested hint deducts -10 points from your total investigator score.
              </p>
            </div>
          </div>

          <button
            onClick={handleRequestHint}
            disabled={allHintsUnlocked || requestingHint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Lightbulb className="w-4 h-4" />
            <span>
              {allHintsUnlocked
                ? "All Hints Unlocked"
                : requestingHint
                ? "Decrypting Hint..."
                : "Request Next Hint (-10 pts)"}
            </span>
          </button>
        </div>

        {/* Hints List */}
        <div className="space-y-2.5">
          {caseData.hints.map((hint, idx) => (
            <div
              key={hint.id}
              className={`p-3 rounded-lg border text-xs transition ${
                hint.unlocked
                  ? "border-amber-400/40 bg-amber-950/20 text-amber-100"
                  : "border-noir-border/50 bg-surface-elevated/40 text-noir-muted flex items-center justify-between"
              }`}
            >
              {hint.unlocked ? (
                <div className="flex items-start gap-2">
                  <span className="font-mono font-bold text-amber-400">
                    Hint #{idx + 1}:
                  </span>
                  <span className="leading-relaxed">{hint.text}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-noir-muted" />
                  <span>
                    Hint #{idx + 1} is sealed. Click "Request Next Hint" to unlock.
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Accusation Modal */}
      {isAccusationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-surface border-2 border-status-error/40 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-4 sm:p-5 bg-surface-elevated border-b border-noir-border flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-status-error">
                <AlertOctagon className="w-6 h-6" />
                <div>
                  <h3 className="text-base font-bold text-noir-text">
                    FINAL ACCUSATION DOCKET
                  </h3>
                  <p className="text-[11px] text-noir-muted">
                    Irreversible Investigation Closure
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAccusationOpen(false)}
                disabled={isSubmittingAccusation}
                className="p-1 rounded text-noir-muted hover:text-noir-text transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-status-error/10 border border-status-error/30 p-3 rounded-lg text-xs text-status-error flex items-start gap-2.5">
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">FINAL VERDICT WARNING:</span>
                  <span>
                    Submitting your accusation locks this case file and evaluates
                    your deduction against the canonical solution on the server.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-noir-muted uppercase font-mono mb-2">
                  Select the True Culprit:
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {caseData.suspects.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSuspectId(s.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border text-left text-xs transition ${
                        selectedSuspectId === s.id
                          ? "border-accent-primary bg-accent-primary/20 text-white font-bold"
                          : "border-noir-border bg-surface-elevated text-neutral-300 hover:border-noir-border/80"
                      }`}
                    >
                      <div>
                        <span className="block text-sm text-noir-text">{s.name}</span>
                        <span className="text-[11px] text-noir-muted font-normal">
                          {s.role}
                        </span>
                      </div>
                      {selectedSuspectId === s.id && (
                        <div className="w-5 h-5 rounded-full bg-accent-primary flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-2.5 pt-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={confirmedWarning}
                  onChange={(e) => setConfirmedWarning(e.target.checked)}
                  className="mt-0.5 rounded border-noir-border bg-surface text-accent-primary"
                />
                <span>
                  I have inspected the clues, evaluated the alibis, and confirm
                  this suspect is the guilty culprit.
                </span>
              </label>
            </div>

            <div className="p-4 bg-surface-elevated border-t border-noir-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAccusationOpen(false)}
                disabled={isSubmittingAccusation}
                className="px-4 py-2 rounded-lg border border-noir-border text-xs text-noir-muted hover:text-noir-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAccusationSubmit}
                disabled={!selectedSuspectId || !confirmedWarning || isSubmittingAccusation}
                className="px-5 py-2 rounded-lg bg-status-error hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition shadow-lg"
              >
                {isSubmittingAccusation
                  ? "Evaluating Deduction..."
                  : "Submit Accusation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
