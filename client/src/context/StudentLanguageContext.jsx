import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLocaleFromPath } from "../utils/localeRouting";

const STORAGE_KEY = "behar-language";

function readInitialLanguage() {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "ar" || stored === "en") return stored;
  return document.documentElement.lang?.toLowerCase().startsWith("ar") ? "ar" : "en";
}

const StudentLanguageContext = createContext(null);

export function StudentLanguageProvider({ children }) {
  const location = useLocation();
  const routeLanguage = getLocaleFromPath(location.pathname);
  const [language, setLanguage] = useState(routeLanguage || readInitialLanguage);

  useEffect(() => {
    if (routeLanguage && routeLanguage !== language) {
      setLanguage(routeLanguage);
    }
  }, [language, routeLanguage]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(() => ({
    language,
    isArabic: language === "ar",
    setLanguage,
    toggleLanguage: () => setLanguage((current) => current === "ar" ? "en" : "ar"),
  }), [language]);

  return <StudentLanguageContext.Provider value={value}>{children}</StudentLanguageContext.Provider>;
}

export function useStudentLanguage() {
  const context = useContext(StudentLanguageContext);
  if (!context) throw new Error("useStudentLanguage must be used inside StudentLanguageProvider");
  return context;
}
