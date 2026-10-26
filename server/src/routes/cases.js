const express = require("express");
const router = express.Router();
const { z } = require("zod");
const geminiService = require("../ai/gemini");
const { CaseRepository } = require("../db");

// Input validation schema
const CreateCaseSchema = z.object({
  premise: z.string().min(10, "Premise must be at least 10 characters.").max(2000),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

// Scoring values for correct accusation
const ACCUSATION_BASE_POINTS = {
  easy: 100,
  medium: 150,
  hard: 200,
};

/**
 * POST /api/cases
 * Generate a new mystery case
 */
router.post("/", async (req, res) => {
  try {
    const parse = CreateCaseSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        error: "Validation error",
        details: parse.error.errors.map((e) => e.message),
      });
    }

    const { premise, difficulty } = parse.data;

    // 1. Generate case via Gemini with difficulty rules
    const aiGeneratedData = await geminiService.generateCase(premise, difficulty);

    // 2. Prepare database record with initialized clues, hints, and progress
    const caseRecord = {
      title: aiGeneratedData.title,
      story: aiGeneratedData.story,
      premise,
      difficulty,
      suspects: aiGeneratedData.suspects,
      clues: aiGeneratedData.clues.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        discovered: false,
        relevance: c.relevance,
      })),
      hints: aiGeneratedData.hints.map((h) => ({
        id: h.id,
        text: h.text,
        unlocked: false,
      })),
      solution: aiGeneratedData.solution,
      progress: {
        discoveredClueIds: [],
        unlockedHintIds: [],
        selectedSuspectId: null,
        score: 0,
        isCompleted: false,
      },
    };

    // 3. Persist to database
    const saved = await CaseRepository.createCase(caseRecord);
    const caseId = saved._id ? saved._id.toString() : saved.id;

    return res.status(201).json({
      caseId,
      title: saved.title,
      difficulty: saved.difficulty,
      status: "active",
    });
  } catch (err) {
    console.error("[POST /api/cases] Error:", err);
    return res.status(500).json({
      error: "Failed to generate mystery case. " + err.message,
    });
  }
});

/**
 * GET /api/cases/:id
 * Retrieve public case details for active investigation
 * Strict security: Solution and isCulprit flags are NEVER sent.
 */
router.get("/:id", async (req, res) => {
  try {
    const caseDoc = await CaseRepository.findCaseById(req.params.id);
    if (!caseDoc) {
      return res.status(404).json({ error: "Case not found." });
    }

    // Public Suspects (omit isCulprit)
    const publicSuspects = caseDoc.suspects.map((s) => ({
      id: s.id,
      name: s.name,
      role: s.role,
      publicMotive: s.publicMotive,
      alibi: s.alibi,
    }));

    // Public Clues (mask undiscovered clue descriptions)
    const publicClues = caseDoc.clues.map((c) => ({
      id: c.id,
      title: c.title,
      discovered: c.discovered || false,
      description: c.discovered ? c.description : null,
      relevance: c.discovered ? c.relevance : null,
    }));

    // Public Hints (only reveal text if unlocked)
    const publicHints = caseDoc.hints.map((h) => ({
      id: h.id,
      unlocked: h.unlocked || false,
      text: h.unlocked ? h.text : null,
    }));

    return res.json({
      id: caseDoc._id ? caseDoc._id.toString() : caseDoc.id,
      title: caseDoc.title,
      story: caseDoc.story,
      premise: caseDoc.premise,
      difficulty: caseDoc.difficulty,
      suspects: publicSuspects,
      clues: publicClues,
      hints: publicHints,
      playerScore: caseDoc.progress.score || 0,
      discoveredClueCount: caseDoc.progress.discoveredClueIds?.length || 0,
      unlockedHintCount: caseDoc.progress.unlockedHintIds?.length || 0,
      isCompleted: caseDoc.progress.isCompleted || false,
    });
  } catch (err) {
    console.error("[GET /api/cases/:id] Error:", err);
    return res.status(500).json({ error: "Failed to retrieve case." });
  }
});

/**
 * POST /api/cases/:id/clues/:clueId/discover
 * Discover an investigation clue (+5 points)
 */
router.post("/:id/clues/:clueId/discover", async (req, res) => {
  try {
    const caseDoc = await CaseRepository.findCaseById(req.params.id);
    if (!caseDoc) {
      return res.status(404).json({ error: "Case not found." });
    }

    if (caseDoc.progress.isCompleted) {
      return res.status(400).json({ error: "Case is already completed." });
    }

    const clue = caseDoc.clues.find((c) => c.id === req.params.clueId);
    if (!clue) {
      return res.status(404).json({ error: "Clue not found in this case." });
    }

    let pointsAdded = 0;
    if (!clue.discovered) {
      clue.discovered = true;
      if (!caseDoc.progress.discoveredClueIds.includes(clue.id)) {
        caseDoc.progress.discoveredClueIds.push(clue.id);
        pointsAdded = 5;
        caseDoc.progress.score = (caseDoc.progress.score || 0) + pointsAdded;
      }

      await CaseRepository.updateCase(req.params.id, {
        clues: caseDoc.clues,
        progress: caseDoc.progress,
      });
    }

    return res.json({
      clueId: clue.id,
      discovered: true,
      description: clue.description,
      relevance: clue.relevance,
      pointsAdded,
      totalScore: caseDoc.progress.score,
    });
  } catch (err) {
    console.error("[POST /discover clue] Error:", err);
    return res.status(500).json({ error: "Failed to discover clue." });
  }
});

/**
 * POST /api/cases/:id/hints
 * Request a strategic hint (-10 points, minimum score: 0)
 */
router.post("/:id/hints", async (req, res) => {
  try {
    const caseDoc = await CaseRepository.findCaseById(req.params.id);
    if (!caseDoc) {
      return res.status(404).json({ error: "Case not found." });
    }

    if (caseDoc.progress.isCompleted) {
      return res.status(400).json({ error: "Case is already completed." });
    }

    // Find the first locked hint
    const nextHint = caseDoc.hints.find((h) => !h.unlocked);
    if (!nextHint) {
      return res.status(400).json({
        error: "All available hints have already been unlocked.",
      });
    }

    nextHint.unlocked = true;
    if (!caseDoc.progress.unlockedHintIds.includes(nextHint.id)) {
      caseDoc.progress.unlockedHintIds.push(nextHint.id);
    }

    // Apply -10 point penalty, min score 0
    const pointsDeducted = 10;
    caseDoc.progress.score = Math.max(0, (caseDoc.progress.score || 0) - pointsDeducted);

    await CaseRepository.updateCase(req.params.id, {
      hints: caseDoc.hints,
      progress: caseDoc.progress,
    });

    return res.json({
      hintId: nextHint.id,
      text: nextHint.text,
      pointsDeducted,
      totalScore: caseDoc.progress.score,
      unlockedHintCount: caseDoc.progress.unlockedHintIds.length,
    });
  } catch (err) {
    console.error("[POST /hints] Error:", err);
    return res.status(500).json({ error: "Failed to unlock hint." });
  }
});

/**
 * POST /api/cases/:id/accuse
 * Submit final accusation, evaluate against canonical solution, and lock case
 */
router.post("/:id/accuse", async (req, res) => {
  try {
    const { suspectId } = req.body;
    if (!suspectId) {
      return res.status(400).json({ error: "suspectId is required." });
    }

    const caseDoc = await CaseRepository.findCaseById(req.params.id);
    if (!caseDoc) {
      return res.status(404).json({ error: "Case not found." });
    }

    // If already completed, return existing results (idempotent)
    if (caseDoc.progress.isCompleted) {
      const isCorrect = caseDoc.progress.selectedSuspectId === caseDoc.solution.culpritId;
      return res.json({
        correct: isCorrect,
        finalScore: caseDoc.progress.score,
        culpritId: caseDoc.solution.culpritId,
        culpritName: caseDoc.solution.culpritName,
        explanation: caseDoc.solution.explanation,
        motive: caseDoc.solution.motive,
        timeline: caseDoc.solution.timeline,
        isCompleted: true,
      });
    }

    // Verify suspect exists
    const suspect = caseDoc.suspects.find((s) => s.id === suspectId);
    if (!suspect) {
      return res.status(400).json({ error: "Invalid suspect ID for this case." });
    }

    const isCorrect = suspectId === caseDoc.solution.culpritId;

    // Calculate score
    const difficulty = caseDoc.difficulty || "medium";
    const baseAccusationPoints = isCorrect
      ? ACCUSATION_BASE_POINTS[difficulty] || 150
      : 0;

    const cluesDiscovered = caseDoc.progress.discoveredClueIds?.length || 0;
    const cluePoints = cluesDiscovered * 5;

    const hintsUsed = caseDoc.progress.unlockedHintIds?.length || 0;
    const hintPenalty = hintsUsed * 10;

    const finalScore = Math.max(0, baseAccusationPoints + cluePoints - hintPenalty);

    // Lock and persist case progress
    caseDoc.progress.selectedSuspectId = suspectId;
    caseDoc.progress.score = finalScore;
    caseDoc.progress.isCompleted = true;
    caseDoc.progress.submittedAt = new Date();

    await CaseRepository.updateCase(req.params.id, {
      progress: caseDoc.progress,
    });

    return res.json({
      correct: isCorrect,
      finalScore,
      scoreBreakdown: {
        accusationPoints: baseAccusationPoints,
        cluePoints,
        hintPenalty,
        total: finalScore,
      },
      selectedSuspect: {
        id: suspect.id,
        name: suspect.name,
      },
      culpritId: caseDoc.solution.culpritId,
      culpritName: caseDoc.solution.culpritName,
      explanation: caseDoc.solution.explanation,
      motive: caseDoc.solution.motive,
      timeline: caseDoc.solution.timeline,
      isCompleted: true,
    });
  } catch (err) {
    console.error("[POST /accuse] Error:", err);
    return res.status(500).json({ error: "Failed to evaluate accusation." });
  }
});

/**
 * GET /api/cases/:id/result
 * Retrieve completed results for a finalized case
 */
router.get("/:id/result", async (req, res) => {
  try {
    const caseDoc = await CaseRepository.findCaseById(req.params.id);
    if (!caseDoc) {
      return res.status(404).json({ error: "Case not found." });
    }

    if (!caseDoc.progress.isCompleted) {
      return res.status(403).json({
        error: "Case is still active. The solution is sealed until an accusation is submitted.",
      });
    }

    const isCorrect = caseDoc.progress.selectedSuspectId === caseDoc.solution.culpritId;
    const selected = caseDoc.suspects.find(
      (s) => s.id === caseDoc.progress.selectedSuspectId
    );

    return res.json({
      caseId: caseDoc._id ? caseDoc._id.toString() : caseDoc.id,
      title: caseDoc.title,
      difficulty: caseDoc.difficulty,
      correct: isCorrect,
      finalScore: caseDoc.progress.score,
      selectedSuspect: {
        id: caseDoc.progress.selectedSuspectId,
        name: selected ? selected.name : "Unknown",
      },
      solution: {
        culpritId: caseDoc.solution.culpritId,
        culpritName: caseDoc.solution.culpritName,
        explanation: caseDoc.solution.explanation,
        motive: caseDoc.solution.motive,
        timeline: caseDoc.solution.timeline,
      },
      submittedAt: caseDoc.progress.submittedAt,
    });
  } catch (err) {
    console.error("[GET /result] Error:", err);
    return res.status(500).json({ error: "Failed to retrieve case result." });
  }
});

module.exports = router;
