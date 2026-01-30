"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { useAuth } from "./AuthContext";

export type ThemeType =
  | "default"
  | "emerald-dark"
  | "slate-grey"
  | "deep-ocean"
  | "royal-violet"
  | "gold-alpha";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isThemeLocked: (theme: ThemeType) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useCustomTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useCustomTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("default");

  const isThemeLocked = (theme: ThemeType): boolean => {
    return false; // All themes are now unlocked
  };

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    setNextTheme(theme);
    localStorage.setItem("tamtech-theme", theme);
  };

  // Sync with next-themes
  useEffect(() => {
    if (nextTheme && nextTheme !== currentTheme) {
      setCurrentTheme(nextTheme as ThemeType);
    }
  }, [nextTheme, currentTheme]);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("tamtech-theme") as ThemeType;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      setNextTheme(savedTheme);
    } else {
      // Default to default theme if no saved theme
      setCurrentTheme("default");
      setNextTheme("default");
    }
  }, [setNextTheme]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme, isThemeLocked }}>
      {children}
    </ThemeContext.Provider>
  );
};