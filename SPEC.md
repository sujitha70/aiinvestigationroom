# AI MYSTERY ROOM — SOFTWARE REQUIREMENTS SPECIFICATION (SPEC.md)

**Project Name:** AI Mystery Room  
**Version:** 2.0  
**Stack:** React, Vite, Tailwind CSS, Node.js, Express, MongoDB (Mongoose), Google Gemini API  
**Submission Form:** https://bit.ly/ai-mystery-room-sub-form  
**Project Deadline:** 2nd November, 11:59 PM  

---

## 1. PROJECT OVERVIEW & PROBLEM STATEMENT

### 1.1 Overview
AI Mystery Room is an interactive, AI-powered detective puzzle web application where players create and solve compelling fictional mysteries generated using Google Gemini. Players analyze suspect dossiers, investigate and discover hidden clues, request strategic hints, and deduce the true culprit.

### 1.2 Problem Statement
Traditional mystery games are static, offering fixed narratives with zero replayability once solved. AI Mystery Room transforms any user-supplied premise into a complete, logically solvable case file with predetermined culprits, consistent clue trails, and an uncompromised answer key verified before play begins.

### 1.3 Target Users
- Detective and mystery fiction fans.
- Students and gamers interested in logical deduction and escape-room puzzles.
- General web users seeking an immersive, interactive AI gameplay experience.

---

## 2. TECHNOLOGY STACK & ARCHITECTURE

The application is architected as two decoupled services:

```text
       +---------------------------------------------+
       |           CLIENT (React + Vite)             |
       |  Tailwind CSS | React Router DOM | Axios    |
       |         Port: 5173 (Development)            |
       +----------------------+----------------------+
                              |
                     REST API Calls (JSON)
                              |
       +----------------------v----------------------+
       |           SERVER (Node.js + Express)        |
       |  CORS | Dotenv | Zod | Mongoose | GenAI SDK |
       |         Port: 5000 (Development)            |
       +----------+-----------------------+----------+
                  |                       |
        Database Operations          AI Generation
                  |                       |
       +----------v----------+ +----------v----------+
       |   MongoDB / Mongoose| |   Google Gemini API |
       |    Cases Collection | | (Structured Output) |
       +---------------------+ +---------------------+
```

### Stack Details
- **Frontend (`/client`):**
  - React 18 / 19 with Vite
  - Tailwind CSS for sleek dark noir detective styling
  - React Router DOM for client-side navigation (`/`, `/create`, `/cases/:id`, `/cases/:id/result`)
  - Axios for HTTP communication with backend API
  - Lucide React for detective iconography

- **Backend (`/server`):**
  - Node.js & Express REST API
  - Mongoose for MongoDB schema modeling and persistence (with fallback in-memory cache for offline/zero-setup resilience)
  - Google GenAI SDK (`@google/genai` & `@google/generative-ai`)
  - Zod for request and AI output validation
  - CORS and Dotenv

---

## 3. USER FLOW & GAMEPLAY JOURNEY

1. **User Landing:** User visits the homepage and learns the gameplay rules, viewing sample cases and features.
2. **Case Creation:** User navigates to `/create`, inputs an incident premise (or clicks a preset), and selects difficulty (`easy`, `medium`, `hard`).
3. **AI Generation:** Backend calls Gemini with structured schemas to generate the mystery, suspects, clues, hints, and canonical answer key. The case is validated and saved to MongoDB.
4. **Investigation Room:** User enters `/cases/:id`:
   - Reads the case synopsis and incident briefing.
   - Inspects suspect dossiers (roles, public motives, claimed alibis).
   - Explores available clues and clicks **Discover Clue** to examine evidence (+5 points each).
   - Requests hints if stuck (-10 points each).
5. **Final Accusation:** User selects their target suspect, confirms the warning, and submits the accusation.
6. **Verdict & Score Reveal:** Server checks the canonical solution, computes points, locks the case, and navigates to `/cases/:id/result`:
   - Verdict Banner: Correct or Incorrect.
   - Culprit identity, hidden motive, and full detective deduction.
   - Breakdown of points and reconstructed timeline.
7. **Replayability:** User can return home or generate a new mystery.

---

## 4. UI AND PAGE SPECIFICATIONS

### Page 1: Home (`/`)
- Hero section introducing the AI detective room concept.
- Primary CTA: **"Create a Mystery"** navigating to `/create`.
- **"How It Works"** section explaining clue discovery, hints, and scoring.
- Sample mystery previews for instant demo play.
- Detective disclaimers and footer.

### Page 2: Create Mystery (`/create`)
- Multiline scenario textarea (minimum 30 characters, max 2000 characters).
- Live character counter.
- Quick preset buttons (e.g., *The Vanishing Diamond*, *The Poisoned Vintage*, *The Server Breach*).
- Difficulty selector: Easy, Medium, Hard.
- Real-time generation progress feedback.

### Page 3: Investigation Room (`/cases/:id`)
- Case briefing card with title, difficulty, location, and story setup.
- Suspect Dossier section displaying each suspect's role, public motive, and alibi.
- Clue Board: Clues displayed with discovered/hidden state. Discovered clues reveal details and add points.
- Hint Terminal: Displays available hints with point penalty disclosure.
- Investigator Score & Progress meter.
- Final Accusation button triggering suspect selection modal.

### Page 4: Results Page (`/cases/:id/result`)
- Verdict: Case Solved (Green) or Investigation Failed (Red).
- Total Score display with points breakdown.
- Culprit reveal card with confirmed identity and secret motive.
- Full detective deduction explaining how the clues logically prove guilt.
- Reconstructed crime timeline.
- Buttons to replay or create a new case.

---

## 5. AI BEHAVIOR & DIFFICULTY MATRIX

Gemini must generate mysteries matching the exact difficulty matrix:

| Difficulty | Suspects Count | Clues Count | Max Hints | Base Accusation Points |
|---|:---:|:---:|:---:|:---:|
| **Easy** | 3 | 5 | 2 | 100 points |
| **Medium** | 4 | 7 | 3 | 150 points |
| **Hard** | 5 | 9 | 3 | 200 points |

### Rules for Gemini:
- Exactly **one** suspect is the guilty culprit (`isCulprit: true`).
- The culprit must exist in the suspects list.
- All clues must logically support the solution or form reasonable red herrings.
- Output must be strict, parseable JSON conforming to the Zod schema.

---

## 6. BACKEND API SPECIFICATION

All endpoints run on Express under `/api/cases`:

### 1. `POST /api/cases`
Generates and persists a new mystery case.
- **Request Body:**
  ```json
  {
    "premise": "A rare emerald disappeared from a locked mansion study.",
    "difficulty": "medium"
  }
  ```
- **Response:**
  ```json
  {
    "caseId": "654321...",
    "title": "The Emerald of Blackwood Manor",
    "difficulty": "medium",
    "status": "active"
  }
  ```

### 2. `GET /api/cases/:id`
Retrieves public case details for investigation.
- **Security Rule:** Culprit identity and solution explanation are strictly excluded.
- **Response:**
  ```json
  {
    "id": "654321...",
    "title": "The Emerald of Blackwood Manor",
    "story": "...",
    "difficulty": "medium",
    "suspects": [...],
    "clues": [
      {
        "id": "clue-1",
        "title": "Study Window Latch",
        "discovered": true,
        "description": "Scratches indicate it was forced from the inside."
      },
      {
        "id": "clue-2",
        "title": "Library Bookshelf",
        "discovered": false
      }
    ],
    "hints": [
      { "id": "hint-1", "unlocked": false }
    ],
    "playerScore": 15,
    "isCompleted": false
  }
  ```

### 3. `POST /api/cases/:id/clues/:clueId/discover`
Discovers a clue, reveals its details, and adds +5 points.
- **Response:**
  ```json
  {
    "clueId": "clue-2",
    "discovered": true,
    "description": "A ledger showing secret debt.",
    "pointsAdded": 5,
    "totalScore": 20
  }
  ```

### 4. `POST /api/cases/:id/hints`
Requests the next available hint and applies the -10 point penalty.
- **Response:**
  ```json
  {
    "hintId": "hint-1",
    "text": "Cross-reference the footprint size with the shoe catalog in the mudroom.",
    "pointsDeducted": 10,
    "totalScore": 10
  }
  ```

### 5. `POST /api/cases/:id/accuse`
Submits final accusation, locks the case, and calculates final score.
- **Request Body:**
  ```json
  {
    "suspectId": "suspect-2"
  }
  ```
- **Response:**
  ```json
  {
    "correct": true,
    "finalScore": 170,
    "culpritId": "suspect-2",
    "culpritName": "Julian Ward",
    "explanation": "Julian had access to the master key...",
    "isCompleted": true
  }
  ```

### 6. `GET /api/cases/:id/result`
Retrieves the completed resolution for a finished case. Rejects incomplete cases.

---

## 7. SCORING RULES

The score is calculated and enforced on the backend:
- **Base Accusation Points:**
  - Easy: 100 points
  - Medium: 150 points
  - Hard: 200 points
  - *Incorrect Accusation:* 0 accusation points.
- **Clue Discovery:** +5 points for each clue discovered.
- **Hint Usage:** -10 points for each hint unlocked.
- **Minimum Score Boundary:** `Math.max(0, calculatedScore)` (score cannot be negative).

---

## 8. DATABASE SCHEMA (MONGODB / MONGOOSE)

```typescript
CaseSchema:
- title: String
- story: String
- premise: String
- difficulty: 'easy' | 'medium' | 'hard'
- suspects: [
    {
      id: String,
      name: String,
      role: String,
      publicMotive: String,
      alibi: String,
      isCulprit: Boolean (hidden on backend until result)
    }
  ]
- clues: [
    {
      id: String,
      title: String,
      description: String,
      discovered: Boolean (default: false),
      relevance: String
    }
  ]
- hints: [
    {
      id: String,
      text: String,
      unlocked: Boolean (default: false)
    }
  ]
- solution: {
    culpritId: String,
    culpritName: String,
    explanation: String,
    motive: String,
    timeline: [
      { time: String, event: String }
    ]
  }
- progress: {
    discoveredClueIds: [String],
    unlockedHintIds: [String],
    selectedSuspectId: String,
    score: Number (default: 0),
    isCompleted: Boolean (default: false),
    submittedAt: Date
  }
- createdAt: Date
```

---

## 9. ACCEPTANCE CRITERIA

- [x] Separate `client` (React + Vite) and `server` (Node.js + Express) projects.
- [x] Gemini structured generation supporting Easy, Medium, and Hard cases.
- [x] Strict server-side secrecy: Culprit and solution withheld until accusation.
- [x] Clue discovery (+5 pts) and Hint request (-10 pts) flows working.
- [x] Final accusation evaluation with correct points (Easy 100, Medium 150, Hard 200).
- [x] Minimum score boundary of 0 enforced.
- [x] Sleek dark detective UI with responsive layout.
- [x] Tested and runnable locally with clear environment instructions.