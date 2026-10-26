# AI MYSTERY ROOM
## Software Requirements Specification (SRS) & Spec-Driven Development Blueprint

**Document Type:** Single Source of Truth for Codex  
**Project Name:** AI Mystery Room  
**Version:** 1.0  
**Status:** Initial Implementation Specification  
**Primary AI Provider:** Google Gemini  
**Product Type:** AI-powered interactive mystery investigation web application

---

# 1. PROJECT OVERVIEW

## 1.1 Project Description

AI Mystery Room is an interactive web application that allows users to create and solve fictional mysteries using artificial intelligence.

The user provides a short scenario, story, or incident. The AI analyzes the input and generates a complete fictional investigation containing a hidden culprit, a timeline of events, suspects, motives, and evidence.

Users investigate the case by examining AI-generated evidence such as WhatsApp-style conversations, photographs, CCTV-style recordings, witness statements, documents, and other clues. After reviewing the available evidence, the user selects the person they believe committed the crime or caused the incident.

The system evaluates the user's accusation against the predefined solution, explains the reasoning, reveals the culprit, and displays the investigation results.

The experience should feel like a digital detective game rather than a traditional chatbot.

## 1.2 Core Product Principle

**Every mystery must have a predetermined solution before the user begins investigating.**

The AI must generate a consistent investigation with one intended culprit, a valid timeline, and evidence that supports the solution. It must not change the culprit or invent new facts in response to the user's selections.

The application should prioritize:
- Logical mysteries rather than random clues.
- Evidence-based deductions rather than guessing.
- Immersive and realistic fictional artifacts.
- A polished, responsive detective-themed interface.
- Repeatable gameplay with saved progress and results.

## 1.3 Problem Statement

Traditional puzzle games often use fixed stories, limited evidence, and repetitive scenarios. AI Mystery Room aims to provide a more flexible experience in which users can submit their own story ideas and receive a unique investigation generated around them.

## 1.4 Project Goals

1. Allow users to create mysteries from their own scenarios.
2. Generate suspects, motives, timelines, and fictional evidence with Gemini.
3. Present evidence in different interactive formats.
4. Allow users to investigate before accusing a suspect.
5. Evaluate accusations against a fixed, predefined answer.
6. Provide a detailed explanation of the solution.
7. Save investigations, progress, and results.
8. Support desktop and mobile browsers.
9. Maintain consistency and reliability across all AI-generated content.

## 1.5 Out of Scope for Version 1

The initial version will not include:
- Real police investigations or real-world criminal accusations.
- Real WhatsApp account access or real surveillance footage.
- Multiplayer investigations.
- Public mystery publishing and community sharing.
- Live video surveillance or actual camera integrations.
- Payments, subscriptions, or paid clue purchases.
- User-created AI models or model training.

All cases and evidence are fictional and generated for entertainment.

---

# 2. TARGET USERS

The application is designed for:
- Mystery and detective story enthusiasts.
- Students interested in logical reasoning.
- Casual gamers.
- Users who enjoy puzzles and escape-room experiences.
- Content creators looking for interactive mystery challenges.

The application must be usable by people without technical knowledge.

---

# 3. TECHNOLOGY STACK

Codex must use the following stack unless a documented technical limitation requires a change.

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js with React and TypeScript | Website and interactive UI |
| Styling | Tailwind CSS | Responsive styling and design system |
| UI Components | shadcn/ui where useful | Accessible interface components |
| Backend | Next.js server-side Route Handlers | Secure application APIs |
| AI | Google Gemini API | Mystery generation and evidence creation |
| AI SDK | Official Google Gen AI SDK for JavaScript/TypeScript | Gemini integration |
| Database | Supabase PostgreSQL | Users, cases, clues, progress, results |
| Authentication | Supabase Auth | Optional accounts and protected user data |
| File Storage | Supabase Storage | Generated evidence images and media |
| Schema Validation | Zod | Validate user input and AI output |
| Testing | Vitest and Playwright | Unit, integration, and browser tests |
| Deployment | Vercel | Hosting the Next.js application |

### Technology requirements

- Use TypeScript throughout the application.
- Use the current stable, mutually compatible package versions at implementation time.
- Keep Gemini API calls on the server only.
- Store API keys and secrets in environment variables.
- Never expose private credentials in browser code or client bundles.
- Use Supabase Row Level Security (RLS) for user-owned data.
- Avoid unnecessary dependencies.
- Do not substitute mock data for real functionality in the final implementation.
- Use the official Gemini documentation to confirm the supported model and API features before implementation.

### Environment variables

Create a `.env.example` file containing placeholders for:

```env
GEMINI_API_KEY=
GEMINI_MODEL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The service role key must be server-only. Never prefix it with `NEXT_PUBLIC_`.

If authentication is enabled, unauthenticated visitors may still create and play a limited number of mysteries through anonymous sessions, subject to server-enforced rate limits. Account creation must not be required for the core experience.

---

# 4. APPLICATION ARCHITECTURE

## 4.1 High-Level Architecture

```text
                    USER
                     |
                     v
          NEXT.JS WEB APPLICATION
                     |
          +----------+----------+
          |                     |
          v                     v
     FRONTEND UI          SERVER API ROUTES
                                |
                    +-----------+-----------+
                    |                       |
                    v                       v
               GEMINI API             SUPABASE
                    |                 PostgreSQL
                    |                 File Storage
                    v
            Mystery Generation
            Evidence Generation
            Solution Validation
                    |
                    v
             SAVED MYSTERY CASE
                    |
                    v
             INVESTIGATION UI
                    |
                    v
          USER SELECTS A CULPRIT
                    |
                    v
          SERVER-SIDE EVALUATION
                    |
                    v
           RESULTS AND EXPLANATION
```

## 4.2 Architecture Rules

1. The frontend must never call Gemini directly.
2. The backend must validate all user inputs.
3. The backend must validate the structure of all AI responses.
4. The complete answer key must remain server-side until the mystery is submitted.
5. The client must never receive hidden culprit information, private motives, or the answer key during investigation.
6. Evidence files must be associated with a specific case and evidence record.
7. Case data and evidence must be persisted before the user begins solving.
8. A failed AI generation must produce a useful error and must not create a broken playable case.
9. The frontend must never assume that AI output is valid merely because Gemini returned a response.
10. All important game rules must be enforced on the server.

---

# 5. USER JOURNEY

The expected user journey is:

1. User opens the landing page.
2. User selects **Create a Mystery**.
3. User enters a short scenario.
4. User configures difficulty, genre, and evidence preferences.
5. User clicks **Generate Mystery**.
6. The application displays generation progress.
7. Gemini creates the case, suspects, timeline, evidence plan, and hidden solution.
8. The backend validates the generated case and saves it.
9. The user enters the investigation room.
10. The user reviews the case briefing and suspects.
11. The user opens evidence items and examines their contents.
12. The user identifies contradictions and forms a theory.
13. The user selects a suspect and submits the accusation.
14. The application evaluates the answer.
15. The results screen reveals the culprit and explains the evidence.
16. The user can replay, return to the dashboard, or create another mystery.

The investigation must be playable without any additional AI conversation.

---

# 6. FUNCTIONAL REQUIREMENTS

## FR-01: Landing Page

The landing page must contain:
- Project logo and name.
- A clear headline describing the mystery-solving experience.
- A short description of how it works.
- A primary **Create a Mystery** button.
- A secondary **How It Works** section or button.
- A small set of sample mystery previews.
- A feature section explaining AI-generated evidence.
- A footer with About, Privacy, and fictional-content disclaimer links.

The primary call to action must navigate to the mystery creation page.

## FR-02: Mystery Creation

The creation page must include the following fields.

### Scenario input

- Required multiline text field.
- Minimum: 30 characters.
- Maximum: 2,000 characters.
- Example placeholder: "A diamond disappeared from a locked hotel room, and four people had access to the corridor."
- Character counter.
- Clear validation messages.
- Trim leading and trailing whitespace.
- Reject empty or whitespace-only input.

### Mystery configuration

| Setting | Options | Default |
|---|---|---|
| Difficulty | Easy, Medium, Hard | Medium |
| Genre | Detective, Theft, Murder Mystery, Missing Person, Cyber Mystery, Custom | Detective |
| Case duration | Quick, Standard, Extended | Standard |
| Evidence style | Text only, Text + Images, Mixed Media | Mixed Media |
| Number of suspects | 3, 4, 5 | 4 |

Murder mysteries must remain fictional and non-graphic.

The configuration should influence the mystery generation prompt. The backend must enforce allowed values and reasonable content limits.

### Creation actions

- Generate Mystery.
- Clear Form.
- Return Home.

When generation starts:
- Disable duplicate submissions.
- Show a loading indicator.
- Display progress messages without falsely claiming that an AI stage has completed.
- Preserve the form input if generation fails.
- Show a retry action for recoverable failures.

## FR-03: AI Mystery Generation

The AI generation system must produce a complete mystery package.

Each mystery package must include:

1. Case title.
2. Case ID.
3. Case summary.
4. Incident description.
5. Incident location.
6. Incident date and time within the fictional story.
7. Suspect list.
8. Suspect profiles.
9. Motives and alibis.
10. Event timeline.
11. Evidence list.
12. Relationships between evidence and suspects.
13. Contradictions and misleading clues.
14. A hidden culprit.
15. A hidden solution explanation.
16. A set of decisive clues.
17. A difficulty rating.
18. A content disclaimer.

### Suspect requirements

Each suspect must have:
- Unique suspect ID.
- Display name.
- Fictional profile.
- Relationship to the incident.
- Publicly visible motive or background.
- Publicly visible alibi.
- Relevant evidence references.
- Private motive and truth fields stored separately from public profile data.

Suspect identities must remain stable throughout a case.

### Mystery quality requirements

The generated mystery must:
- Have exactly one intended culprit.
- Include at least three suspects.
- Include at least three evidence items.
- Provide enough information to deduce the culprit.
- Contain at least two clues that materially support the correct solution.
- Include at least one meaningful contradiction or misleading clue.
- Maintain a consistent timeline.
- Avoid making every suspect obviously innocent except one.
- Ensure red herrings do not make the mystery logically unsolvable.
- Keep all evidence consistent with the predefined solution.

For the Easy difficulty, clues should be relatively direct. Medium difficulty should require connecting multiple clues. Hard difficulty should require more careful reasoning across evidence sources.

These requirements must be validated wherever possible. The system must not claim a mystery is logically valid merely because it passed JSON validation.

## FR-04: Evidence Generation

The system must support the following evidence types.

### A. WhatsApp-style conversations

Display fictional chat conversations containing:
- Fictional contact names.
- Message text.
- Timestamps.
- Sender and receiver identities.
- Optional delivery or read indicators.
- Optional group conversations.

The UI must use an original chat-style interface rather than imply that messages came from an actual WhatsApp account.

Each conversation must be consistent with the case timeline.

### B. AI-generated photographs

Generate fictional evidence images, where image generation is available, such as:
- Room or crime-scene illustrations.
- Objects found at the scene.
- Fictional documents.
- Items belonging to suspects.
- Relevant locations.
- Photographic clues.

Each image must have:
- Evidence ID.
- Title.
- Description.
- Image URL or storage path.
- Associated case ID.
- Optional timestamp and location.
- A caption explaining what the investigator can inspect.

The AI must not create images that contradict the written evidence.

### C. CCTV-style evidence

The application must support a CCTV-style evidence viewer.

For the first version, the system should create a convincing fictional CCTV evidence artifact using one of the following methods:
- A generated still image with timestamp overlays.
- A sequence of AI-generated frames presented as a simulated recording.
- An AI-generated short video if the configured video provider supports it.

Do not claim that a video was generated if only a still image exists.

If video generation is unavailable, use a sequence of frames or a still image and label the artifact accurately. A functional evidence viewer is mandatory; actual AI video generation is optional.

The CCTV evidence must include:
- Camera identifier.
- Fictional location.
- Timestamp.
- Visible events.
- Optional gaps or obstructions.
- Description of the relevant clue.

### D. Witness statements

Display fictional witness interviews containing:
- Witness identity.
- Statement.
- Interview timestamp.
- Relationship to the case.
- Optional inconsistencies.
- Links to related evidence.

### E. Documents and forensic-style reports

Support:
- Fictional receipts.
- Access logs.
- Emails.
- Notes.
- Incident reports.
- Digital activity logs.
- Relevant schedules or records.

Every evidence item must be linked to a case and should have a meaningful investigative purpose.

## FR-05: Evidence Viewer

The investigation page must contain an evidence board or evidence library.

Users must be able to:
- View all available evidence.
- Filter evidence by type.
- Open individual evidence items.
- Read detailed descriptions.
- Zoom into images where appropriate.
- View chat messages in chronological order.
- Play supported video artifacts or inspect simulated CCTV frames.
- Mark evidence as reviewed.
- Return to the evidence board without losing progress.

Each evidence item must have a stable identifier.

Opening evidence must not accidentally reveal the culprit or private solution.

## FR-06: Investigation Dashboard

The investigation room must contain:

1. Case header.
2. Case summary.
3. Suspect list.
4. Evidence board.
5. Investigation timeline.
6. Evidence review progress.
7. Notes area.
8. Accusation panel.
9. Case progress indicator.

The interface must make the distinction between suspects, evidence, and the final accusation clear.

The user must be able to move between these sections without reloading the entire application unnecessarily.

## FR-07: Suspect Selection

The accusation panel must:
- Display all suspects.
- Allow exactly one suspect to be selected.
- Require an explicit confirmation before submission.
- Provide a final accusation button.
- Prevent empty submissions.
- Clearly warn users that submitting an accusation completes the investigation.

For Version 1, users may submit one final accusation per case. After submission, the case is locked for scoring.

The user may still review the results and evidence afterward.

## FR-08: Answer Evaluation

Evaluation must happen on the backend using the stored case solution.

The server must compare the submitted suspect ID with the canonical culprit ID.

The result must contain:
- Correct or incorrect status.
- Selected suspect.
- Actual culprit.
- Final score.
- Explanation of the solution.
- Important supporting clues.
- Explanation of relevant contradictions.
- Short feedback about the user's deduction.

The system must not ask Gemini to decide the answer from scratch during submission.

Gemini may generate the explanation during initial case creation. The evaluation endpoint must use the saved answer key as the source of truth.

## FR-09: Scoring System

The scoring system must use a maximum of 100 points.

| Component | Points |
|---|---:|
| Correct final accusation | 70 |
| Evidence review completion | 20 |
| Optional hint usage bonus | 10 |
| Total | 100 |

Rules:
- Incorrect accusations receive 0 accusation points.
- Evidence review points are awarded based on the percentage of evidence reviewed.
- The hint bonus is available only if the user completes the case without using hints.
- The total score must never exceed 100.
- The score is calculated and validated on the server.

Formula:

`Score = Accusation Points + Evidence Review Points + Hint Bonus`

Evidence review points:

`Evidence Review Points = round(20 × reviewed evidence count / total evidence count)`

The application must not award points based on client-submitted score values.

## FR-10: Results Page

The results page must include:
- Correct/Incorrect status.
- Final score.
- Culprit reveal.
- Explanation of the motive.
- Reconstructed timeline.
- Evidence supporting the solution.
- Explanation of misleading clues.
- A short case conclusion.
- Play Again.
- Return to Home.

The answer key must only be returned after the server confirms that the case has been submitted.

## FR-11: Saved Cases and Progress

The application must save:
- Case details.
- Suspects.
- Evidence metadata.
- Evidence file locations.
- Current case status.
- Reviewed evidence IDs.
- User notes.
- Selected accusation.
- Final score.
- Completion timestamp.

The user must not lose saved progress when navigating between pages or refreshing the browser.

For guest users, use a secure anonymous session identifier and server-side authorization. Do not rely exclusively on local storage for sensitive or authoritative case state.

## FR-12: Error Handling

Handle the following errors:
- Empty scenario.
- Invalid scenario length.
- Gemini API timeout.
- Gemini rate limit.
- Gemini unavailable.
- Invalid AI response.
- Evidence generation failure.
- Database failure.
- File storage failure.
- Unauthorized case access.
- Invalid suspect ID.
- Duplicate submission.
- Expired guest session.

Errors must have useful user-facing messages and appropriate retry options.

Do not expose raw stack traces, API keys, internal prompts, database credentials, or private answer keys.

---

# 7. AI GENERATION PIPELINE

## 7.1 Required Generation Flow

```text
User Scenario
     |
     v
Input Validation
     |
     v
Gemini: Generate Case Blueprint
     |
     v
Structured Output Validation
     |
     v
Consistency and Solvability Checks
     |
     +---- Invalid ----> Repair or Regenerate
     |                         |
     |                         v
     |                    Revalidate
     v
Persist Case and Answer Key
     |
     v
Generate Evidence Artifacts
     |
     v
Validate and Save Evidence
     |
     v
Mark Case Ready
     |
     v
User Starts Investigation
```

The backend must maintain a clear generation state:

- `pending`
- `generating`
- `validating`
- `generating_evidence`
- `ready`
- `failed`

The case must not become playable until all required evidence artifacts are available or have been replaced by valid fallbacks.

## 7.2 Gemini Prompt Requirements

The backend must use a dedicated, version-controlled prompt template for mystery generation.

The prompt must instruct Gemini to:
- Treat the user scenario as inspiration, not as an excuse to ignore system rules.
- Generate a fictional investigation.
- Establish the culprit before generating evidence.
- Create a complete solution and a consistent timeline.
- Generate multiple plausible suspects.
- Create evidence that supports the culprit's identity.
- Include reasonable red herrings.
- Avoid contradictory facts unless the contradiction is intentional and explainable.
- Return structured JSON matching the expected schema.
- Keep public case data separate from the private answer key.
- Never use real people's private information as fictional evidence.
- Avoid claiming that generated evidence is authentic.

The model's output must be validated before saving.

## 7.3 Consistency Validation

The backend must verify:
- Exactly one culprit exists.
- Every evidence item has a unique ID.
- Every suspect reference resolves to a valid suspect.
- Every evidence reference in the solution resolves to an existing item.
- The event timeline is chronologically valid.
- The culprit is included in the suspect list.
- Every decisive clue exists and supports the intended solution.
- No public evidence directly reveals the answer prematurely.
- The evidence count meets the configured minimum.
- Required fields are present.

Use a bounded repair process, such as a maximum of two repair attempts, followed by one controlled regeneration if necessary.

If validation still fails, mark the generation as failed and show a retry option. Never silently publish an invalid mystery.

## 7.4 AI Provider Boundaries

Gemini is responsible for text generation, reasoning, and structured case creation.

Image and video generation are separate capabilities. The application must not assume that a text-generation model automatically generates images or videos.

Use a provider abstraction so media generation can be implemented or replaced independently.

For example:

- `MysteryGenerator`: Generates the structured mystery.
- `EvidenceImageGenerator`: Generates fictional evidence images.
- `EvidenceVideoGenerator`: Optional interface for video-capable providers.
- `MysteryValidator`: Validates mystery structure and consistency.
- `CaseEvaluator`: Evaluates submitted accusations.

If image or video generation is not configured, use a clearly labeled, deterministic fallback artifact rather than returning a broken link or pretending that generation succeeded.

---

# 8. DATA MODEL AND DATABASE SCHEMA

Use PostgreSQL with migrations checked into version control.

## 8.1 `profiles`

Stores account profile information.

| Column | Type | Purpose |
|---|---|---|
| id | UUID, primary key | References authenticated user |
| display_name | TEXT | User's display name |
| created_at | TIMESTAMPTZ | Account creation time |

## 8.2 `cases`

Stores the main mystery record.

| Column | Type | Purpose |
|---|---|---|
| id | UUID, primary key | Case identifier |
| owner_id | UUID, nullable | Account owner, if authenticated |
| session_id | UUID, nullable | Guest session association |
| title | TEXT | Mystery title |
| scenario | TEXT | Original user scenario |
| genre | TEXT | Mystery genre |
| difficulty | TEXT | Difficulty setting |
| status | TEXT | Generation and investigation state |
| public_summary | JSONB | Public case information |
| answer_key | JSONB | Private solution and culprit |
| generation_version | TEXT | Prompt/schema version |
| created_at | TIMESTAMPTZ | Creation timestamp |
| completed_at | TIMESTAMPTZ, nullable | Completion timestamp |

The answer key must be accessible only to trusted server-side code.

It must never be included in public API responses, public database views, or client-accessible database queries.

## 8.3 `suspects`

| Column | Type | Purpose |
|---|---|---|
| id | UUID, primary key | Suspect identifier |
| case_id | UUID, foreign key | Associated case |
| name | TEXT | Fictional name |
| public_profile | JSONB | Publicly visible profile |
| private_profile | JSONB | Hidden information |
| created_at | TIMESTAMPTZ | Creation timestamp |

## 8.4 `evidence`

| Column | Type | Purpose |
|---|---|---|
| id | UUID, primary key | Evidence identifier |
| case_id | UUID, foreign key | Associated case |
| type | TEXT | chat, image, cctv, statement, document |
| title | TEXT | Evidence title |
| description | TEXT | Evidence description |
| content | JSONB | Type-specific evidence data |
| storage_path | TEXT, nullable | Media storage location |
| generation_status | TEXT | Generation state |
| created_at | TIMESTAMPTZ | Creation timestamp |

## 8.5 `case_progress`

| Column | Type | Purpose |
|---|---|---|
| id | UUID, primary key | Progress identifier |
| case_id | UUID, foreign key | Associated case |
| owner_id | UUID, nullable | Authenticated owner |
| session_id | UUID, nullable | Guest session |
| reviewed_evidence_ids | JSONB | Reviewed evidence identifiers |
| notes | TEXT | Investigation notes |
| selected_suspect_id | UUID, nullable | Final accusation |
| score | INTEGER, nullable | Calculated score |
| status | TEXT | in_progress or completed |
| submitted_at | TIMESTAMPTZ, nullable | Submission timestamp |

Enforce a unique progress record for each permitted player session and case.

## 8.6 Database Rules

- Add foreign-key constraints.
- Add indexes for frequently queried case and owner IDs.
- Use migrations rather than relying only on manually created tables.
- Apply RLS policies to user-owned records.
- Validate UUIDs and relationships on the server.
- Never trust IDs or ownership claims supplied by the client without authorization checks.
- Use private storage buckets and short-lived signed URLs for media where appropriate.
- Keep the answer key inaccessible to public database clients.

---

# 9. API SPECIFICATION

All endpoints must be implemented as server-side Next.js Route Handlers under `/api`.

## POST `/api/cases`

Creates a new mystery generation job.

Request:

```json
{
  "scenario": "A valuable painting disappeared from a locked gallery.",
  "genre": "detective",
  "difficulty": "medium",
  "duration": "standard",
  "evidenceStyle": "mixed",
  "suspectCount": 4
}
```

Response:

```json
{
  "caseId": "uuid",
  "status": "generating"
}
```

The API must validate the request, enforce rate limits, and associate the case with the current authenticated or guest session.

## GET `/api/cases/:caseId`

Returns the case's generation status and public case data.

Response while generating:

```json
{
  "caseId": "uuid",
  "status": "generating"
}
```

Response when ready:

```json
{
  "caseId": "uuid",
  "status": "ready",
  "title": "The Vanishing Portrait",
  "summary": "A valuable painting disappeared during a private exhibition.",
  "suspects": [],
  "evidence": []
}
```

The response must exclude all private solution fields.

## GET `/api/cases/:caseId/evidence`

Returns evidence metadata and content available to the authorized investigator.

Must not reveal the culprit, hidden motives, or the private answer key.

## PATCH `/api/cases/:caseId/progress`

Saves progress.

Example request:

```json
{
  "reviewedEvidenceIds": ["evidence-uuid"],
  "notes": "The guard's timeline conflicts with the entry log."
}
```

The server must validate that each evidence ID belongs to the requested case.

## POST `/api/cases/:caseId/accusation`

Submits the final accusation.

Request:

```json
{
  "suspectId": "suspect-uuid"
}
```

Response:

```json
{
  "correct": true,
  "score": 90,
  "result": {
    "culpritId": "suspect-uuid",
    "explanation": "The access log and the message timestamps establish the culprit's opportunity."
  }
}
```

This endpoint is the only normal gameplay endpoint allowed to reveal the answer key, and only after a valid, authorized final submission.

The response must be created from the saved case solution, not from a new unconstrained AI guess.

A completed case must not accept another accusation unless an explicit future replay feature is added.

## GET `/api/cases/:caseId/result`

Returns the saved result for a completed case. It must reject requests for incomplete cases.

## API-wide requirements

- Use appropriate HTTP status codes.
- Validate request bodies with Zod.
- Enforce authorization and session ownership.
- Use consistent error response structures.
- Add server-side rate limits.
- Make generation and accusation submission idempotent where appropriate.
- Do not expose internal prompts, private database fields, or credentials.

---

# 10. USER INTERFACE AND DESIGN SYSTEM

## 10.1 Design Direction

The interface should feel like a modern digital detective room with cinematic atmosphere and clean usability.

The UI should be dark, immersive, and professional—not cluttered, cartoonish, or excessively animated.

### Color palette

| Token | Color | Usage |
|---|---|---|
| Background | `#0B1020` | Main application background |
| Surface | `#151C2E` | Panels and cards |
| Elevated Surface | `#1D2740` | Modals and active cards |
| Primary Accent | `#8B5CF6` | Main actions and selection |
| Secondary Accent | `#22D3EE` | Evidence highlights |
| Main Text | `#F8FAFC` | Primary text |
| Muted Text | `#94A3B8` | Supporting text |
| Success | `#34D399` | Correct results |
| Error | `#FB7185` | Incorrect results and errors |
| Border | `#334155` | Card and panel borders |

## 10.2 Typography

- Use Inter or a comparable modern sans-serif font.
- Use clear heading hierarchy.
- Maintain readable text sizes.
- Use monospaced typography selectively for timestamps, camera logs, and case identifiers.

## 10.3 Main Pages

### Page 1: Home

- Hero section.
- Main call to action.
- How It Works.
- Sample mystery cards.
- Feature highlights.
- Footer.

### Page 2: Create Mystery

- Scenario textarea.
- Genre selector.
- Difficulty selector.
- Evidence style selector.
- Suspect count selector.
- Generate button.
- Input validation and loading states.

### Page 3: Generation Screen

- Case generation status.
- Progress indicator.
- Stage descriptions.
- Error and retry states.

Progress messages must reflect real backend states. Do not simulate completed stages while the server is still processing.

### Page 4: Investigation Room

Desktop layout:
- Left sidebar: case summary and navigation.
- Main area: evidence board and evidence viewer.
- Right sidebar: suspect list and investigation notes.

Mobile layout:
- Stacked sections.
- Collapsible suspect and evidence panels.
- Full-screen evidence modal or detail page.
- Sticky accusation button when appropriate.

### Page 5: Results

- Result banner.
- Score.
- Culprit reveal.
- Evidence breakdown.
- Timeline reconstruction.
- Explanation of the correct solution.
- Replay and home actions.

## 10.4 UI Interaction Requirements

- Use clear loading, empty, success, and error states.
- Provide keyboard-accessible navigation.
- Use accessible dialog and modal behavior.
- Provide focus indicators.
- Avoid relying on color alone to communicate status.
- Ensure responsive layouts at common desktop, tablet, and mobile sizes.
- Prevent accidental loss of notes and progress.
- Include confirmation before irreversible submission.
- Use animations sparingly and respect reduced-motion preferences.

---

# 11. SECURITY, PRIVACY, AND CONTENT RULES

1. Gemini API keys must remain server-side.
2. Validate and sanitize user input.
3. Treat all AI output as untrusted until validated.
4. Enforce request size limits and generation rate limits.
5. Protect database records with RLS and server-side authorization.
6. Prevent unauthorized access to another user's cases.
7. Do not return hidden culprit information before submission.
8. Do not allow users to modify scores or mark arbitrary evidence as belonging to a case.
9. Do not expose internal error details.
10. Use private media storage and controlled access URLs.
11. Avoid logging complete secrets, credentials, or unnecessary personal information.
12. Do not generate real-looking evidence intended to impersonate real people or establish real-world guilt.
13. Label generated media and fictional evidence clearly.
14. Provide a disclaimer that cases are fictional and are not intended for real investigations.
15. Add a basic privacy notice explaining what data is saved and how users can delete their data.

The system must not use real private conversations, real surveillance footage, or real personal data as evidence unless a separately authorized, privacy-compliant feature is introduced in a future version.

---

# 12. PERFORMANCE AND RELIABILITY

- The landing page should render without requiring a Gemini API call.
- Evidence browsing must use saved case data rather than regenerate evidence on every visit.
- Use appropriate loading indicators for long-running AI generation.
- Avoid blocking the entire application while a case is being generated.
- Use bounded retries for transient AI failures.
- Use request timeouts and clear failure states.
- Store generated media instead of regenerating it on every request.
- Prevent duplicate case creation from repeated button clicks.
- Keep database queries scoped to the authorized case.
- Use pagination or lazy loading if evidence libraries become large.

If generation may exceed the request timeout supported by the deployment platform, implement a persisted background job or equivalent resumable processing mechanism. Do not rely on an indefinitely running HTTP request.

---

# 13. TESTING REQUIREMENTS

## Unit tests

Test:
- Input validation.
- Scenario length boundaries.
- AI output schema validation.
- Suspect ID validation.
- Score calculation.
- Evidence review calculations.
- Timeline validation.
- Culprit evaluation.
- Duplicate accusation prevention.

## Integration tests

Test:
- Case creation and persistence.
- Gemini error handling.
- Case validation and retry behavior.
- Evidence storage.
- Progress saving.
- Authorization and session ownership.
- Result generation.
- Answer-key protection.

## End-to-end tests

Test the following complete flow:

1. Open the homepage.
2. Create a mystery.
3. Enter a valid scenario.
4. Generate the case.
5. Wait for the case to become ready.
6. Open suspect profiles.
7. Review evidence.
8. Save investigation notes.
9. Select a suspect.
10. Submit the accusation.
11. Verify the result and score.
12. Refresh the results page.
13. Verify that the saved result remains available.

Also test:
- Invalid input.
- Gemini unavailable.
- Invalid generated JSON.
- Evidence generation failure.
- Unauthorized access to another case.
- Attempt to read the answer key before submission.
- Duplicate final submission.
- Mobile navigation.

---

# 14. ACCEPTANCE CRITERIA

The project is considered complete only when all mandatory criteria below pass.

### Mystery creation
- [ ] Users can enter a scenario and configure the mystery.
- [ ] The backend generates a structured mystery through Gemini.
- [ ] The mystery includes at least three suspects.
- [ ] The mystery includes at least three meaningful evidence items.
- [ ] Exactly one intended culprit is stored.
- [ ] The case is validated before becoming playable.

### Evidence
- [ ] Evidence is generated or supplied through a clearly identified fallback.
- [ ] WhatsApp-style chats render correctly.
- [ ] Image evidence displays correctly when image generation is configured.
- [ ] CCTV-style evidence has an accurate representation of the underlying media.
- [ ] Every evidence item belongs to the correct case.
- [ ] Evidence remains available after a page refresh.

### Gameplay
- [ ] Users can review evidence and suspects.
- [ ] Investigation notes and reviewed evidence persist.
- [ ] Users can select and submit one suspect.
- [ ] The server determines correctness using the stored answer key.
- [ ] The score follows the defined scoring formula.
- [ ] Results reveal the culprit and explain the supporting evidence.

### Security
- [ ] The Gemini API key is not exposed to the browser.
- [ ] The private answer key is not exposed before submission.
- [ ] Users cannot access unauthorized cases.
- [ ] The server calculates the score.
- [ ] Duplicate accusation submissions are rejected or handled idempotently.

### Product quality
- [ ] The application works on desktop and mobile.
- [ ] All main navigation and buttons perform their intended actions.
- [ ] Loading, error, and empty states exist.
- [ ] Database migrations are included.
- [ ] `.env.example` is included.
- [ ] Automated tests cover critical business logic.
- [ ] Setup and deployment instructions are documented.

---

# 15. REQUIRED PROJECT STRUCTURE

Codex should create a maintainable structure similar to:

```text
ai-mystery-room/
├── app/
│   ├── page.tsx
│   ├── create/
│   │   └── page.tsx
│   ├── cases/
│   │   └── [caseId]/
│   │       ├── page.tsx
│   │       └── result/
│   │           └── page.tsx
│   └── api/
│       └── cases/
│           ├── route.ts
│           └── [caseId]/
│               ├── route.ts
│               ├── evidence/
│               │   └── route.ts
│               ├── progress/
│               │   └── route.ts
│               ├── accusation/
│               │   └── route.ts
│               └── result/
│                   └── route.ts
├── components/
│   ├── layout/
│   ├── mystery/
│   ├── evidence/
│   ├── suspects/
│   └── ui/
├── lib/
│   ├── ai/
│   │   ├── gemini.ts
│   │   ├── prompts.ts
│   │   └── schemas.ts
│   ├── mystery/
│   │   ├── generator.ts
│   │   ├── validator.ts
│   │   └── evaluator.ts
│   ├── evidence/
│   │   ├── image-generator.ts
│   │   └── video-generator.ts
│   ├── db/
│   ├── auth/
│   ├── validation/
│   └── utils/
├── supabase/
│   └── migrations/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
├── .env.example
├── package.json
├── README.md
└── SPEC.md
```

This is a proposed structure, not a requirement to create empty files for every entry. Codex must implement the actual required functionality and may adjust internal organization without changing the public behavior or architectural rules.

---

# 16. IMPLEMENTATION PHASES

## Phase 1 — Foundation
- Initialize Next.js, TypeScript, and Tailwind.
- Establish the design system.
- Create the homepage and mystery creation form.
- Configure Supabase.
- Add database migrations and environment configuration.

**Completion:** The application starts locally and the basic navigation works.

## Phase 2 — AI Mystery Engine
- Integrate Gemini.
- Define structured generation schemas.
- Create mystery generation prompts.
- Implement validation and repair logic.
- Persist cases, suspects, and answer keys securely.

**Completion:** A valid case can be generated and saved.

## Phase 3 — Evidence Engine
- Implement evidence generation and storage.
- Build chat, image, document, and CCTV-style evidence components.
- Add media fallbacks.
- Validate evidence consistency.

**Completion:** The generated case contains usable evidence.

## Phase 4 — Investigation Gameplay
- Build the investigation room.
- Implement evidence review and suspect navigation.
- Add persistent notes and progress.
- Build the accusation flow.

**Completion:** A user can investigate and submit a suspect.

## Phase 5 — Evaluation and Results
- Implement server-side evaluation.
- Add scoring.
- Build the results screen.
- Persist completed results.

**Completion:** Correct and incorrect accusations produce the appropriate results.

## Phase 6 — Hardening and Deployment
- Add security checks and rate limits.
- Test AI failures and authorization boundaries.
- Run unit, integration, and end-to-end tests.
- Document deployment and configuration.

**Completion:** The core application works reliably in a deployed environment.

---

# 17. CODEX EXECUTION RULES

This section is mandatory. Codex must treat this document as the authoritative specification.

1. Read `SPEC.md` before writing or modifying application code.
2. Inspect the existing repository before making changes.
3. Do not overwrite working files or existing project configuration without understanding their purpose.
4. Implement the project in the phases defined above.
5. Maintain a `TASKS.md` file that tracks implementation progress.
6. Maintain an `ARCHITECTURE.md` file for significant architectural decisions.
7. If an implementation decision is not specified, choose the simplest secure solution consistent with this document and record the decision.
8. Do not silently change functional requirements, scoring rules, API contracts, or data ownership rules.
9. Never hardcode the Gemini API key or database credentials.
10. Never expose the answer key in client-side state, HTML, browser network responses before submission, or publicly accessible database records.
11. Never claim that image or video generation works unless the corresponding provider is configured and tested.
12. Do not use static demo data as a substitute for required AI generation in the finished application.
13. Sample cases may be included for UI development, but they must be explicitly identified as fixtures or sample data.
14. Every visible button must have a real action.
15. Every important data mutation must be persisted.
16. Run relevant tests after each implementation phase.
17. Fix failing tests before proceeding to the next phase when the failure affects the current phase.
18. Do not mark a task complete merely because its component has been created.
19. Update the README with setup, environment variables, migrations, testing, and deployment instructions.
20. Do not claim completion if required providers, database access, or critical tests are unavailable.

## Definition of Done

The project is done when a user can submit a story, receive a validated fictional mystery, inspect its evidence, identify a suspect, submit an accusation, and receive a persistent, logically consistent result—all through a functioning website.

---

# 18. INITIAL DEVELOPMENT PRIORITIES

Codex should prioritize the following order:

1. Build a working end-to-end application with text-based mysteries.
2. Make mystery generation deterministic in structure and validate its solution.
3. Secure the hidden answer key.
4. Build the investigation room and evidence interactions.
5. Implement persistent progress and result scoring.
6. Add image generation.
7. Add CCTV-style media and optional real AI video generation.
8. Polish animations, responsiveness, accessibility, and visual details.

Do not delay the entire project because video generation is unavailable. Text, chat, and document evidence must work first; image and video capabilities can be integrated through independent providers.

**Final product requirement:** Deliver a functional, maintainable AI Mystery Room web application—not merely a UI prototype, a collection of mock screens, or a chatbot interface.

End of specification.