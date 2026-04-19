import api from "../lib/api";

export function getInternProfile() {
  return api.get("/intern/profile");
}

export function getInternTestQuestions() {
  return api.get("/intern/test/questions");
}

export function updateInternProfile(payload) {
  return api.post("/intern/update-profile", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });


  return api.post("/intern/update-profile", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function startInternTest() {
  return api.post("/intern/start-test");
}

export function submitInternTest(payload) {
  return api.post("/intern/submit-test", payload);
}

export function applyInternJob(payload) {
  return api.post("/intern/apply", payload);
}

export function getInternApplications() {
  return api.get("/intern/applications");
}

// ── Pengalaman Kerja ─────────────────────────────────────────
export const getExperiences   = ()         => api.get("/intern/experiences");
export const addExperience    = (data)     => api.post("/intern/experiences", data);
export const updateExperience = (id, data) => api.put(`/intern/experiences/${id}`, data);
export const deleteExperience = (id)       => api.delete(`/intern/experiences/${id}`);

// ── Lisensi & Sertifikasi ────────────────────────────────────
export const getLicenses   = ()         => api.get("/intern/licenses");
export const addLicense    = (data)     => api.post("/intern/licenses", data);
export const updateLicense = (id, data) => api.put(`/intern/licenses/${id}`, data);
export const deleteLicense = (id)       => api.delete(`/intern/licenses/${id}`);  