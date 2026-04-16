import api from "../lib/api";

const COMPANY_PROFILE_ENDPOINT = "/company/profile";
const COMPANY_PROFILE_UPDATE_ENDPOINT = "/company/profile/update";

export function getCompanyProfile() {
  return api.get(COMPANY_PROFILE_ENDPOINT);
}

export function updateCompanyProfile(payload) {
  return api.post(COMPANY_PROFILE_UPDATE_ENDPOINT, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getCompanyProfileData(response) {
  return response?.data?.data || response?.data || {};
}

export function getCompanyFallbackLogo(name) {
  const source = String(name || "Company")
    .replace(/^pt\.?\s*/i, "")
    .trim();

  const initials = source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return initials || "CO";
}
