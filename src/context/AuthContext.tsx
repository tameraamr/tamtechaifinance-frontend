"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const BASE_URL = "https://tamtechaifinance-backend-production.up.railway.app";

interface User {
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  country?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  credits: number;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, userData: User, credits: number) => void;
  logout: () => void;
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
  const [token, setToken] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!token && !!user;

  // Fetch user data from API
  const fetchUserData = async (authToken: string): Promise<{ user: User; credits: number } | null> => {
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
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
          },
          credits: data.credits,
        };
      } else if (response.status === 401) {
        // Only logout on explicit 401 (Unauthorized) - token is invalid
        localStorage.removeItem('access_token');
        return null;
      } else {
        // For other errors (5xx, network issues, timeouts), don't logout
        // Just return null to indicate validation failed, but keep the token
        console.warn('Auth validation failed, but keeping token:', response.status);
        return null;
      }
    } catch (error) {
      // Network errors, timeouts, etc. - don't logout, just return null
      console.warn('Auth validation network error, keeping token:', error);
      return null;
    }
  };

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('access_token');

      if (savedToken) {
        const userData = await fetchUserData(savedToken);
        if (userData) {
          // Token is valid and user data fetched successfully
          setToken(savedToken);
          setUser(userData.user);
          setCredits(userData.credits);
        } else {
          // Check if token still exists in localStorage (only removed on 401)
          const tokenStillExists = localStorage.getItem('access_token') !== null;
          if (tokenStillExists) {
            // Token exists but validation failed (network/server issues)
            // Keep the token but don't set user data - user will be prompted to retry
            setToken(savedToken);
            setUser(null);
            setCredits(0);
          } else {
            // Token was removed (401 error) - clear all state
            setToken(null);
            setUser(null);
            setCredits(0);
          }
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, userData: User, userCredits: number) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
    setUser(userData);
    setCredits(userCredits);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    setCredits(0);
  };

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  const refreshUserData = async () => {
    if (!token) return;

    const userData = await fetchUserData(token);
    if (userData) {
      setUser(userData.user);
      setCredits(userData.credits);
    } else {
      // Token became invalid during refresh
      logout();
    }
  };

  const retryValidation = async () => {
    const savedToken = localStorage.getItem('access_token');
    if (!savedToken) return;

    setIsLoading(true);
    const userData = await fetchUserData(savedToken);
    if (userData) {
      setToken(savedToken);
      setUser(userData.user);
      setCredits(userData.credits);
    } else {
      // Check if token still exists (only removed on 401)
      const tokenStillExists = localStorage.getItem('access_token') !== null;
      if (!tokenStillExists) {
        // Token was removed (401 error) - clear all state
        setToken(null);
        setUser(null);
        setCredits(0);
      }
      // If token still exists, keep current state (validation failed but token is valid)
    }
    setIsLoading(false);
  };

  const value: AuthContextType = {
    user,
    token,
    credits,
    isLoggedIn,
    isLoading,
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