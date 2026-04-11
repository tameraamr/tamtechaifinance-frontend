/**
 * @fileoverview Authentication Context — Portfolio Demo Mode.
 *
 * In demo mode, this provider bypasses all backend authentication
 * and immediately presents the user as a verified Pro subscriber.
 * No fetch() calls are made; all state is hardcoded.
 *
 * Original architecture supported httpOnly cookie-based JWT sessions
 * with the FastAPI backend on Railway.
 *
 * @author Tamer — TamtechAI Finance
 * @version 2.0.0 — Portfolio Demo Mode
 */
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";
import { MOCK_USER } from "../lib/mockData";

interface User {
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  country?: string;
  address?: string;
  is_verified?: number | boolean;
  is_pro?: number | boolean;
  subscription_expiry?: string | null;
}

interface AuthContextType {
  user: User | null;
  credits: number;
  isLoggedIn: boolean;
  isVerified: boolean;
  isPro: boolean;
  subscriptionExpiry: string | null;
  isLoading: boolean;
  login: (userData: User, credits: number) => Promise<void>;
  logout: () => Promise<void>;
  updateCredits: (newCredits: number) => void;
  refreshUserData: () => Promise<void>;
  retryValidation: () => Promise<void>;
  verifyGumroadLicense: (licenseKey: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Hook to access authentication state throughout the app */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider — Demo Mode Implementation.
 *
 * Immediately sets the user as a verified Pro subscriber with 999 credits.
 * All auth actions (login, logout, license verification) are no-ops that
 * display toast notifications indicating demo mode.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState(999);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = true;
  const isVerified = true;
  const isPro = true;
  const subscriptionExpiry = MOCK_USER.subscription_expiry;

  // Initialize with mock user immediately
  useEffect(() => {
    const mockUser: User = {
      email: MOCK_USER.email,
      first_name: MOCK_USER.first_name,
      last_name: MOCK_USER.last_name,
      phone_number: MOCK_USER.phone_number,
      country: MOCK_USER.country,
      address: MOCK_USER.address ?? undefined,
      is_verified: MOCK_USER.is_verified,
      is_pro: MOCK_USER.is_pro,
      subscription_expiry: MOCK_USER.subscription_expiry,
    };

    setUser(mockUser);
    setCredits(MOCK_USER.credits);

    // Simulate brief loading for skeleton effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  /** No-op login — shows demo toast */
  const login = async (_userData: User, _credits: number) => {
    toast.success("🔒 Portfolio Demo Mode — You're already logged in!", {
      duration: 3000,
    });
  };

  /** No-op logout — shows demo toast */
  const logout = async () => {
    toast("🔒 Portfolio Demo Mode — Logout disabled", {
      icon: "ℹ️",
      duration: 3000,
    });
  };

  /** Updates credit count in state */
  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  /** No-op refresh — data is static */
  const refreshUserData = async () => {
    // No-op in demo mode
  };

  /** No-op retry — always valid */
  const retryValidation = async () => {
    // No-op in demo mode
  };

  /** No-op license verification — always succeeds */
  const verifyGumroadLicense = async (_licenseKey: string): Promise<boolean> => {
    toast.success("🔒 Portfolio Demo Mode — License verification simulated", {
      duration: 3000,
    });
    return true;
  };

  const value: AuthContextType = {
    user,
    credits,
    isLoggedIn,
    isVerified,
    isPro,
    subscriptionExpiry,
    isLoading,
    login,
    logout,
    updateCredits,
    refreshUserData,
    retryValidation,
    verifyGumroadLicense,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};