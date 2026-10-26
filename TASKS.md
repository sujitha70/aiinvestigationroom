# AI Mystery Room — Implementation Tasks Tracker

## Phase 1: Create a Detailed Spec Sheet
- [x] Create comprehensive `SPEC.md` covering all project requirements
- [x] Document complete User Flow (Landing -> Create -> Investigation -> Accuse -> Result)
- [x] Document UI & Page Specifications (Home, Create Mystery, Investigation Room, Results)
- [x] Document Backend & Database Design with Mongoose schema and 6 REST endpoints
- [x] Document AI Behavior with Difficulty Matrix (Easy: 3/5/2, Medium: 4/7/3, Hard: 5/9/3)
- [x] Document Scoring Rules (Easy 100, Med 150, Hard 200 pts; Clue +5; Hint -10; Min 0)
- [x] Document Acceptance Criteria

## Phase 2: Set Up the Project
- [x] Initialize frontend React + Vite application in `client/`
- [x] Install frontend dependencies: `react-router-dom`, `axios`, `tailwindcss`, `lucide-react`
- [x] Initialize backend Node.js + Express application in `server/`
- [x] Install backend dependencies: `express`, `cors`, `dotenv`, `mongoose`, `@google/genai`, `@google/generative-ai`, `zod`, `nodemon`
- [x] Create backend `.env` and `.env.example` with `PORT`, `MONGODB_URI`, `GEMINI_API_KEY`, `CLIENT_URL`

## Phase 3: Build the Application
- [x] Set up Express and connect MongoDB with Mongoose (and resilient local fallback)
- [x] Create Mongoose Case model (`server/src/models/Case.js`)
- [x] Implement Gemini structured mystery generation with difficulty matrix (`server/src/ai/gemini.js`)
- [x] Implement API endpoints:
  - [x] `POST /api/cases` (Generate mystery & save)
  - [x] `GET /api/cases/:id` (Retrieve active mystery; solution kept strictly private)
  - [x] `POST /api/cases/:id/clues/:clueId/discover` (Discover clue & award +5 pts)
  - [x] `POST /api/cases/:id/hints` (Unlock hint & deduct -10 pts)
  - [x] `POST /api/cases/:id/accuse` (Submit accusation & calculate score)
  - [x] `GET /api/cases/:id/result` (Retrieve final verdict and breakdown)
- [x] Build React pages:
  - [x] `Home.jsx` (Hero, rules table, how it works)
  - [x] `CreateMystery.jsx` (Premise input, presets, difficulty selector)
  - [x] `InvestigationRoom.jsx` (Suspects, clue board with discover action, hints system, accusation modal)
  - [x] `Results.jsx` (Verdict banner, score breakdown, culprit reveal, reconstructed timeline)

## Phase 4: Test and Verify
- [x] Verify backend API endpoints with end-to-end integration test
- [x] Verify clue discovery (+5 pts) and hint penalty (-10 pts) score tracking
- [x] Verify accusation scoring (Easy: 100, Medium: 150, Hard: 200) and solution secrecy
- [x] Verify Vite frontend production build (`npm run build`)
- [x] Document deployment instructions for Vercel, Render, and MongoDB Atlas
