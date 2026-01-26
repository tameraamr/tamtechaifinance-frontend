"use client";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useTranslation, languages, SupportedLanguage } from "../context/TranslationContext";

export default function LanguageSelector() {
  const { lang, setLang, isRTL } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLang(newLang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Globe Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 md:px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg hover:border-blue-600/50 transition-all text-slate-300 hover:text-blue-300"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden md:inline text-xs font-bold uppercase">{lang}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200`}>
          <div className="p-2">
            <div className="text-xs font-bold text-slate-500 px-3 py-2 uppercase tracking-wider">
              Select Language
            </div>
            <div className="space-y-1">
              {Object.entries(languages).map(([code, info]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code as SupportedLanguage)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                    lang === code
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="text-xl">{info.flag}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{info.nativeName}</div>
                    <div className="text-xs opacity-70">{info.name}</div>
                  </div>
                  {lang === code && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
