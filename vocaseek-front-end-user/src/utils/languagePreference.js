import axios from "axios";
import { getAccessToken, isAuthenticated } from "./authStorage";

export const LANGUAGE_STORAGE_KEY = "vocaseek_language";
export const DEFAULT_LANGUAGE = "id";
const LANGUAGE_ENDPOINT = "/language";

export const LANGUAGE_OPTIONS = [
  { code: "id", shortLabel: "ID", label: "Bahasa Indonesia", accent: "Merah Putih" },
  { code: "en", shortLabel: "EN", label: "English", accent: "Global" },
];

// ✅ Buat instance axios khusus language — selalu pakai BASE_URL, bukan role-based URL
const langApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  withCredentials: false,
});

// Inject token setiap request
langApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getSavedLanguage() {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return LANGUAGE_OPTIONS.some((o) => o.code === saved) ? saved : DEFAULT_LANGUAGE;
}

export function applyLanguagePreference(language) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = language;
  document.documentElement.dataset.appLanguage = language;
}

export function saveLanguagePreference(language) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    window.dispatchEvent(new Event("language-changed"));
  }
  applyLanguagePreference(language);
}

export async function syncLanguageFromServer() {
  if (!isAuthenticated()) {
    const fallbackLanguage = getSavedLanguage();
    applyLanguagePreference(fallbackLanguage);
    return fallbackLanguage;
  }

  try {
    const response = await langApi.get(LANGUAGE_ENDPOINT);
    const locale = response?.data?.data?.locale;
    const normalized = LANGUAGE_OPTIONS.some((o) => o.code === locale)
      ? locale
      : DEFAULT_LANGUAGE;
    saveLanguagePreference(normalized);
    return normalized;
  } catch {
    const currentLang = document.documentElement.lang || getSavedLanguage();
    const isValid = LANGUAGE_OPTIONS.some((o) => o.code === currentLang);
    const safeLang = isValid ? currentLang : getSavedLanguage();
    applyLanguagePreference(safeLang);
    return safeLang;
  }
}

export async function persistLanguagePreference(language) {
  saveLanguagePreference(language);
  if (!isAuthenticated()) return language;

  try {
    const response = await langApi.put(LANGUAGE_ENDPOINT, { locale: language });
    const locale = response?.data?.data?.locale;
    const normalized = LANGUAGE_OPTIONS.some((o) => o.code === locale)
      ? locale
      : language;
    saveLanguagePreference(normalized);
    return normalized;
  } catch {
    return language;
  }
}