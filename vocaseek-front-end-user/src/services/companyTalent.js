import api from "../lib/api";

const COMPANY_TALENT_BASE = "/company/talent";
const COMPANY_BASE = "/company";

// ─── Admin Mitra: Kandidat ────────────────────────────────────────────────────

export function getCompanyCandidates() {
  return api.get(`${COMPANY_TALENT_BASE}/candidates`);
}

export function getCompanyCandidateDetail(id) {
  return api.get(`${COMPANY_TALENT_BASE}/candidates/${id}/detail`);
}

export function createManualCompanyCandidate(payload) {
  return api.post(`${COMPANY_TALENT_BASE}/candidates/manual`, payload);
}

export function updateCompanyCandidateStatus(id, payload) {
  return api.put(`${COMPANY_TALENT_BASE}/candidates/${id}/status`, payload);
}

export function getSelectedCompanyCandidates() {
  return api.get(`${COMPANY_TALENT_BASE}/selected`);
}

// ─── Admin Mitra: Dashboard ───────────────────────────────────────────────────

export function getCompanyDashboard() {
  return api.get(`${COMPANY_BASE}/dashboard`);
}

// ─── User (Intern): Status Lamaran ───────────────────────────────────────────
// ⚠️  Sesuaikan endpoint di bawah dengan route yang tersedia di backend

// services/companyTalent.js

export function getMyApplicationStatus() {
  return api.get("/intern/applications/latest");
}