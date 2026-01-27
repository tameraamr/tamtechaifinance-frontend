"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 🔥 Use relative path to leverage Vercel rewrite (makes cookies first-party)
const BASE_URL = typeof window !== 'undefined' ? '/api' : 'https://tamtechaifinance-backend-production.up.railway.app';

interface User {
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  country?: string;
  address?: string;
  is_verified?: number | boolean;  // 0/1 or false/true
}

interface AuthContextType {
  user: User | null;
  credits: number;
  isLoggedIn: boolean;
  isVerified: boolean;
  isLoading: boolean;
  suppressBanner: boolean;
  login: (userData: User, credits: number) => void;
  logout: () => Promise<void>;
  updateCredits: (newCredits: number) => void;
  refreshUserData: () => Promise<void>;
  retryValidation: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [suppressBanner, setSuppressBanner] = useState(false);

  const isLoggedIn = isAuthenticated && !!user;
  // Handle both boolean true and number 1 for is_verified
  const isVerified = user?.is_verified === 1 || user?.is_verified === true;

  // 🧹 Clean up old localStorage token on mount (one-time migration)
  useEffect(() => {
    const oldToken = localStorage.getItem('access_token');
    if (oldToken) {
      console.log('🧹 Cleaning up old localStorage token...');
      localStorage.removeItem('access_token');
    }
  }, []);

  // Fetch user data from API (cookie is sent automatically)
  const fetchUserData = async (): Promise<{ user: User; credits: number } | null> => {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        credentials: 'include', // 🔥 Critical: Send httpOnly cookie automatically
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          user: {
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            phone_number: data.phone_number,
            country: data.country,
            address: data.address,
            is_verified: data.is_verified,
          },
          credits: data.credits,
        };
      } else if (response.status === 401) {
        // Token invalid or expired
        return null;
      } else {
        // For other errors (5xx, network issues), don't clear auth state
        console.warn('Auth validation failed, but keeping session:', response.status);
        return null;
      }
    } catch (error) {
      // Network errors - keep session
      console.warn('Auth validation network error, keeping session:', error);
      return null;
    }
  };

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const userData = await fetchUserData();
      if (userData) {
        setUser(userData.user);
        setCredits(userData.credits);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setCredits(0);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: User, userCredits: number) => {
    // No need to store token - it's in httpOnly cookie
    setUser(userData);
    setCredits(userCredits);
    setIsAuthenticated(true);
    setSuppressBanner(true);
    setTimeout(() => setSuppressBanner(false), 1000);
  };

  const logout = async () => {
    try {
      // Call backend logout to clear cookie
      await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    }
    
    // Clear frontend state regardless of backend response
    setUser(null);
    setCredits(0);
    setIsAuthenticated(false);
  };

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  const refreshUserData = async () => {
    const userData = await fetchUserData();
    if (userData) {
      setUser(userData.user);
      setCredits(userData.credits);
      setIsAuthenticated(true);
    } else {
      // Token became invalid during refresh
      await logout();
    }
  };

  const retryValidation = async () => {
    setIsLoading(true);
    const userData = await fetchUserData();
    if (userData) {
      setUser(userData.user);
      setCredits(userData.credits);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setCredits(0);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const value: AuthContextType = {
    user,
    credits,
    isLoggedIn,
    isVerified,
    isLoading,
    suppressBanner,
    login,
    logout,
    updateCredits,
    refreshUserData,
    retryValidation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};