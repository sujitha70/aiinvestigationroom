# AI Mystery Room — Architecture & Design Decisions

## 1. High-Level Architecture

The system follows a strict client-server boundary enforced through Next.js App Router (React Server Components and API Route Handlers):

```text
                    USER (Browser)
                         |
                         v
              NEXT.JS CLIENT APPLICATION
                         |
              +----------+----------+
              |                     |
              v                     v
         FRONTEND UI         SERVER API ROUTES (`/api/cases/*`)
                                    |
                        +-----------+-----------+
                        |                       |
                        v                       v
                   GEMINI API            DATABASE / STORAGE
            (Structured JSON Schema)    (Supabase PostgreSQL &
                        |                Local Resilient Adaptor)
                        v                       |
                Case Blueprint                  |
             Consistency Validator              |
                        |                       |
                        +----------->+<---------+
                                     |
                                     v
                           PERSISTED CASE RECORD
                       (Public Data vs Private Answer Key)
```

## 2. Key Architectural Decisions

### 2.1 Server-Only Gemini Integration
- **Decision:** All interactions with Google Gemini remain strictly on the backend inside Route Handlers and server libraries (`lib/ai/*`).
- **Rationale:** Protects the `GEMINI_API_KEY` and prevents tampering with generation parameters or prompt injection.

### 2.2 Strict Answer Key Isolation
- **Decision:** Case data is split into `public_summary` (safe for investigator) and `answer_key` (canonical solution, culprit ID, hidden motives, and secret alibis).
- **Rationale:** Prevents cheating or data leaks. The client receives the answer key ONLY after a final accusation is submitted via `POST /api/cases/:caseId/accusation`.

### 2.3 Dual Persistence Strategy (Supabase + Resilient Local Adaptor)
- **Decision:** The database repository (`lib/db/repository.ts`) connects to Supabase when configured (`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`), and seamlessly falls back to a file-backed local store in development/offline modes.
- **Rationale:** Ensures complete zero-setup local development and testability while retaining 100% compatibility with production Supabase PostgreSQL and Row Level Security.

### 2.4 Bounded Generation & Consistency Validation
- **Decision:** When Gemini returns the case blueprint, the server validates:
  1. Zod schema conformance.
  2. Exactly one culprit who exists in the suspect list.
  3. Every decisive clue exists in the generated evidence set.
  4. Chronological timeline consistency.
  A maximum of 2 repair attempts and 1 controlled regeneration is allowed before returning a clean error.

### 2.5 Multi-Media Evidence Generator with Deterministic Fallbacks
- **Decision:** Evidence generation supports WhatsApp-style chats, witness statements, forensic reports, scene photographs, and simulated CCTV camera recordings. If external image/video generation APIs are not active, the system generates high-fidelity SVG/Canvas camera frames, dark security HUD overlays, and forensic document renderings instead of broken links.
