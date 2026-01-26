"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fullTranslations, languages, SupportedLanguage } from "../translations";

interface TranslationContextType {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: typeof fullTranslations.en;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SupportedLanguage>("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as SupportedLanguage;
    if (savedLang && fullTranslations[savedLang]) {
      setLangState(savedLang);
    }
  }, []);

  // Save language to localStorage and update HTML dir attribute
  const setLang = (newLang: SupportedLanguage) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.dir = (newLang === "ar" || newLang === "he") ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  // Update HTML attributes when language changes
  useEffect(() => {
    document.documentElement.dir = (lang === "ar" || lang === "he") ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = fullTranslations[lang] || fullTranslations.en;
  const isRTL = lang === "ar" || lang === "he";

  return (
    <TranslationContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}

export { languages, type SupportedLanguage };
