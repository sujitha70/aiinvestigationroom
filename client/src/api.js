import axios from "axios";

// In development, Vite proxies /api to http://localhost:5000/api
// For standalone or production, fallback to VITE_API_URL or relative /api
const API_BASE = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export const casesApi = {
  createCase: (premise, difficulty) =>
    api.post("/cases", { premise, difficulty }),
  getCase: (id) => api.get(`/cases/${id}`),
  discoverClue: (caseId, clueId) =>
    api.post(`/cases/${caseId}/clues/${clueId}/discover`),
  requestHint: (caseId) => api.post(`/cases/${caseId}/hints`),
  submitAccusation: (caseId, suspectId) =>
    api.post(`/cases/${caseId}/accuse`, { suspectId }),
  getResult: (caseId) => api.get(`/cases/${caseId}/result`),
};
