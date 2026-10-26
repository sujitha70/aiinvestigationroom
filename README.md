# AI Mystery Room 🔍🕵️‍♂️

**Project Submission Form:** [https://bit.ly/ai-mystery-room-sub-form](https://bit.ly/ai-mystery-room-sub-form)  
**Project Deadline:** 2nd November, 11:59 PM  

AI Mystery Room is an interactive AI-powered detective puzzle web application where users create and solve mysteries generated using **Google Gemini**. Players investigate suspects, uncover discoverable clues, request strategic hints, and deduce the true culprit.

---

## 🚀 Technology Stack

### Frontend (`/client`)
- **React 18** with **Vite**
- **Tailwind CSS** (Dark noir detective theme with custom glows)
- **React Router DOM v6** (Client-side routing)
- **Axios** (API integration with proxy support)
- **Lucide React** (Vector detective & UI icons)

### Backend (`/server`)
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** (with built-in local persistence fallback)
- **Google Gemini API** (`@google/genai` & `@google/generative-ai`)
- **Zod** (Schema validation for user requests and AI outputs)
- **CORS** & **Dotenv**

---

## 📂 Project Architecture

```text
aiinvestigation/
├── SPEC.md               # Complete Project Requirements & Architecture Specification
├── README.md             # Setup, documentation, and deployment guide
├── client/               # React + Vite Frontend
│   ├── src/
│   │   ├── components/   # Navbar, Footer
│   │   ├── pages/        # Home, CreateMystery, InvestigationRoom, Results
│   │   ├── api.js        # Axios API client
│   │   ├── App.jsx       # Route configurations
│   │   ├── index.css     # Tailwind & detective theme styling
│   │   └── main.jsx      # React entrypoint
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── server/               # Express + MongoDB Backend
    ├── src/
    │   ├── ai/           # Gemini service & structured mystery prompt engine
    │   ├── models/       # Mongoose Case model
    │   ├── routes/       # Case management, clue discovery, hint, accusation APIs
    │   ├── db.js         # Mongoose connector with resilient fallback
    │   └── index.js      # Express server entrypoint
    ├── .env              # Backend environment variables
    ├── .env.example
    └── package.json
```

---

## 🎯 Gameplay & Difficulty Matrix

| Difficulty | Suspects | Clues | Hints | Correct Accusation Points |
|---|:---:|:---:|:---:|:---:|
| **Easy** | 3 | 5 | 2 | **100 pts** |
| **Medium** | 4 | 7 | 3 | **150 pts** |
| **Hard** | 5 | 9 | 3 | **200 pts** |

### Scoring Rules
- **Base Accusation Points:** 100 (Easy) / 150 (Medium) / 200 (Hard) for identifying the true culprit. 0 points for incorrect accusations.
- **Clue Discovery:** **+5 points** for each clue discovered.
- **Hint Usage:** **-10 points** for each hint requested.
- **Minimum Score Boundary:** Final score is clamped to `Math.max(0, total)` (never negative).
- **Server-Side Secrecy:** The culprit identity, hidden motives, and solution explanation remain locked on the backend until the player confirms their accusation.

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (optional local instance or MongoDB Atlas connection string)
- **Google Gemini API Key** ([Get your free key here](https://aistudio.google.com/))

### 1. Backend Setup
1. Open a terminal and navigate to `server`:
   ```bash
   cd server
   npm install
   ```
2. Configure `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ai_mystery_room
   GEMINI_API_KEY=your_gemini_api_key_here
   CLIENT_URL=http://localhost:5173
   ```
3. Start the backend:
   ```bash
   npm run dev
   # Server runs at http://localhost:5000
   ```

### 2. Frontend Setup
1. In a second terminal, navigate to `client`:
   ```bash
   cd client
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   # Client runs at http://localhost:5173
   ```
3. Open `http://localhost:5173` in your browser.

---

## 🌐 API Specification

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/cases` | Generate a new mystery case via Gemini and save to MongoDB |
| `GET` | `/api/cases/:id` | Retrieve active case file (solution & culprit strictly omitted) |
| `POST` | `/api/cases/:id/clues/:clueId/discover` | Discover a clue, reveal details, and award +5 points |
| `POST` | `/api/cases/:id/hints` | Unlock the next hint and apply -10 point penalty |
| `POST` | `/api/cases/:id/accuse` | Submit final accusation, evaluate against answer key, and lock case |
| `GET` | `/api/cases/:id/result` | Retrieve completed resolution, score breakdown, and timeline |
| `GET` | `/api/health` | Service health status check |

---

## 🚢 Deployment Guide

### Backend (e.g. Render, Railway, or VPS)
1. Push your repository to GitHub.
2. In your hosting platform, create a new Web Service pointing to the `/server` directory.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables:
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB Atlas connection URI.
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `CLIENT_URL`: The deployed URL of your Vercel frontend.

### Frontend (e.g. Vercel)
1. In Vercel, import your GitHub repository and set the **Root Directory** to `client`.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-backend.onrender.com/api`)
5. Deploy and test the live mystery-solving flow.

---

## 📝 License
Built for the AI Mystery Room Challenge. All case scenarios, characters, and clues are generated for entertainment and puzzle-solving purposes.
