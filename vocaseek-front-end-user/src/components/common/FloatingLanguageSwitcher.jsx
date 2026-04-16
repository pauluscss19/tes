import { useEffect, useRef, useState } from "react";
import {
  applyLanguagePreference,
  getSavedLanguage,
  LANGUAGE_OPTIONS,
  persistLanguagePreference,
  syncLanguageFromServer,
} from "../../utils/languagePreference";

export default function FloatingLanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState(() => getSavedLanguage());
  const [isUpdating, setIsUpdating] = useState(false);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    applyLanguagePreference(selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    const loadLanguage = async () => {
      if (isUpdatingRef.current) {
        return;
      }

      try {
        const syncedLanguage = await syncLanguageFromServer();
        setSelectedLanguage(syncedLanguage);
      } catch {
        setSelectedLanguage(getSavedLanguage());
      }
    };

    const syncLanguage = () => {
      loadLanguage();
    };

    loadLanguage();
    window.addEventListener("storage", syncLanguage);
    window.addEventListener("auth-changed", syncLanguage);

    return () => {
      window.removeEventListener("storage", syncLanguage);
      window.removeEventListener("auth-changed", syncLanguage);
    };
  }, []);

  const handleLanguageChange = async (languageCode) => {
    if (languageCode === selectedLanguage || isUpdatingRef.current) {
      return;
    }

    isUpdatingRef.current = true;
    setSelectedLanguage(languageCode);
    setIsUpdating(true);

    try {
      const normalizedLanguage = await persistLanguagePreference(languageCode);
      setSelectedLanguage(normalizedLanguage);
    } catch {
      setSelectedLanguage(getSavedLanguage());
    } finally {
      isUpdatingRef.current = false;
      setIsUpdating(false);
    }
  };

  return (
    <div className="floating-language-switcher" aria-label="Language switcher">
      <div className="floating-language-switcher__actions" role="group" aria-label="Pilih bahasa">
        {LANGUAGE_OPTIONS.map((option) => (
          <button
            key={option.code}
            type="button"
            className={`floating-language-switcher__button ${
              selectedLanguage === option.code ? "active" : ""
            }`}
            onClick={() => {
              void handleLanguageChange(option.code);
            }}
            aria-pressed={selectedLanguage === option.code}
            title={option.label}
            disabled={isUpdating}
          >
            {option.shortLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
