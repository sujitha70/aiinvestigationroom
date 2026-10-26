const mongoose = require("mongoose");

const SuspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  publicMotive: { type: String, required: true },
  alibi: { type: String, required: true },
  isCulprit: { type: Boolean, default: false }, // KEPT HIDDEN ON BACKEND
});

const ClueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  discovered: { type: Boolean, default: false },
  relevance: { type: String },
});

const HintSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  unlocked: { type: Boolean, default: false },
});

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  story: { type: String, required: true },
  premise: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  suspects: [SuspectSchema],
  clues: [ClueSchema],
  hints: [HintSchema],
  solution: {
    culpritId: { type: String, required: true },
    culpritName: { type: String, required: true },
    explanation: { type: String, required: true },
    motive: { type: String, required: true },
    timeline: [
      {
        time: { type: String },
        event: { type: String },
      },
    ],
  },
  progress: {
    discoveredClueIds: [{ type: String }],
    unlockedHintIds: [{ type: String }],
    selectedSuspectId: { type: String, default: null },
    score: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    submittedAt: { type: Date },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Case", CaseSchema);
