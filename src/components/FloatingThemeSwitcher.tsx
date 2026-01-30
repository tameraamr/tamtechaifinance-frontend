"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Lock, Crown, Sparkles } from "lucide-react";
import { useCustomTheme, ThemeType } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

interface ThemeOption {
  id: ThemeType;
  name: string;
  description: string;
  icon: React.ReactNode;
  colors: {
    primary: string;
    secondary: string;
  };
}

const themeOptions: ThemeOption[] = [
  {
    id: "default",
    name: "Default",
    description: "Original Tamtech theme",
    icon: <Palette className="w-4 h-4" />,
    colors: {
      primary: "#3b82f6",
      secondary: "#2563eb",
    },
  },
  {
    id: "emerald-dark",
    name: "Emerald Dark",
    description: "Classic dark theme",
    icon: <Palette className="w-4 h-4" />,
    colors: {
      primary: "#10B981",
      secondary: "#059669",
    },
  },
  {
    id: "slate-grey",
    name: "Slate Grey",
    description: "Clean grey tones",
    icon: <Palette className="w-4 h-4" />,
    colors: {
      primary: "#E4E4E7",
      secondary: "#CBD5E1",
    },
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    description: "Midnight blue depths",
    icon: <Palette className="w-4 h-4" />,
    colors: {
      primary: "#38BDF8",
      secondary: "#0EA5E9",
    },
  },
  {
    id: "royal-violet",
    name: "Royal Violet",
    description: "Legendary purple",
    icon: <Crown className="w-4 h-4" />,
    colors: {
      primary: "#A855F7",
      secondary: "#9333EA",
    },
  },
  {
    id: "gold-alpha",
    name: "Gold Alpha",
    description: "Prestigious gold",
    icon: <Sparkles className="w-4 h-4" />,
    colors: {
      primary: "#FFD700",
      secondary: "#F59E0B",
    },
  },
];

export default function FloatingThemeSwitcher() {
  const { theme, setTheme, isThemeLocked } = useCustomTheme();
  const { credits } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleThemeSelect = (themeId: ThemeType) => {
    setTheme(themeId);
    setIsExpanded(false);
    toast.success("Theme applied successfully!", {
      duration: 2000,
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Theme Options Menu */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            className="mb-4 p-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl"
          >
            <div className="grid grid-cols-2 gap-3">
              {themeOptions.map((themeOption, index) => {
                const isLocked = isThemeLocked(themeOption.id);
                const isActive = theme === themeOption.id;

                return (
                  <motion.button
                    key={themeOption.id}
                    onClick={() => handleThemeSelect(themeOption.id)}
                    disabled={isLocked}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                    className={`
                      group relative flex flex-col items-center gap-2 p-3 rounded-xl
                      backdrop-blur-md border transition-all duration-300 cursor-pointer
                      ${isActive
                        ? 'bg-white/20 border-white/30 shadow-lg shadow-white/10'
                        : 'bg-slate-800/40 border-slate-600/30 hover:bg-slate-700/60 hover:border-slate-500/50'
                      }
                    `}
                  >
                    {/* Theme Preview Colors */}
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 rounded-full border border-white/20"
                        style={{ backgroundColor: themeOption.colors.primary }}
                      />
                      <div
                        className="w-2 h-2 rounded-full border border-white/20"
                        style={{ backgroundColor: themeOption.colors.secondary }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-white">
                          {themeOption.name}
                        </span>
                        {isActive && <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />}
                      </div>
                      <p className="text-[10px] text-slate-300 leading-tight">
                        {themeOption.description}
                      </p>
                    </div>

                    {/* Icon */}
                    <div className={`${isActive ? 'text-white' : 'text-slate-400'} transition-colors text-sm`}>
                      {themeOption.icon}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          group relative w-14 h-14 rounded-full
          backdrop-blur-md bg-slate-900/80 border border-slate-700/50
          hover:bg-slate-800/90 hover:border-slate-600/70
          transition-all duration-300 shadow-lg hover:shadow-xl
          flex items-center justify-center
          ${isExpanded ? 'rotate-45' : ''}
        `}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <Palette className="w-6 h-6 text-white relative z-10 transition-transform duration-300" />

        {/* Pulse animation when expanded */}
        {isExpanded && (
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-ping" />
        )}
      </button>
    </div>
  );
}