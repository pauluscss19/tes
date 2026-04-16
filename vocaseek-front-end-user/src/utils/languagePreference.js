import api from "../lib/api";
import { isAuthenticated } from "./authStorage";

export const LANGUAGE_STORAGE_KEY = "vocaseek_language";
export const DEFAULT_LANGUAGE = "id";
const LANGUAGE_ENDPOINT = "/language";

export const LANGUAGE_OPTIONS = [
  {
    code: "id",
    shortLabel: "ID",
    label: "Bahasa Indonesia",
    accent: "Merah Putih",
  },
  {
    code: "en",
    shortLabel: "EN",
    label: "English",
    accent: "Global",
  },
];

export function getSavedLanguage() {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return LANGUAGE_OPTIONS.some((option) => option.code === saved)
    ? saved
    : DEFAULT_LANGUAGE;
}

export function applyLanguagePreference(language) {
  if (typeof document === "undefined") {
    return;
  }

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

  const response = await api.get(LANGUAGE_ENDPOINT);
  const locale = response?.data?.data?.locale;
  const normalizedLocale = LANGUAGE_OPTIONS.some((option) => option.code === locale)
    ? locale
    : DEFAULT_LANGUAGE;

  saveLanguagePreference(normalizedLocale);
  return normalizedLocale;
}

export async function persistLanguagePreference(language) {
  saveLanguagePreference(language);

  if (!isAuthenticated()) {
    return language;
  }

  const response = await api.put(LANGUAGE_ENDPOINT, {
    locale: language,
  });

  const locale = response?.data?.data?.locale;
  const normalizedLocale = LANGUAGE_OPTIONS.some((option) => option.code === locale)
    ? locale
    : language;

  saveLanguagePreference(normalizedLocale);
  return normalizedLocale;
}
