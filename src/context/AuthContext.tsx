"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

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
  login: (userData: User, credits: number) => Promise<void>;
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

  const isLoggedIn = isAuthenticated && !!user;
  // Handle both boolean true and number 1 for is_verified
  const isVerified = user?.is_verified === 1 || user?.is_verified === true;

  // 🎉 Personalized Welcome Notification
  const showWelcomeToast = (userName: string, userCredits: number) => {
    // Only show toast on client side
    if (typeof window === 'undefined') return;

    const displayName = userName || 'User';

    // Get current theme from localStorage (avoiding circular dependency)
    const currentTheme = localStorage.getItem('tamtech-theme') || 'default';

    // Theme-aware styling
    const getThemeStyles = () => {
      switch (currentTheme) {
        case 'gold-alpha':
          return {
            style: {
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
              border: '1px solid #FFD700',
              boxShadow: '0 10px 40px rgba(255, 215, 0, 0.3)',
              color: '#FFD700',
            },
            icon: '✨',
          };
        case 'royal-violet':
          return {
            style: {
              background: 'linear-gradient(135deg, #1a0b2e 0%, #2a1b4a 100%)',
              border: '1px solid #A855F7',
              boxShadow: '0 10px 40px rgba(168, 85, 247, 0.3)',
              color: '#e9d5ff',
            },
            icon: '👑',
          };
        case 'emerald-dark':
          return {
            style: {
              background: 'linear-gradient(135deg, #050505 0%, #0a0a0a 100%)',
              border: '1px solid #10B981',
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
              color: '#d1fae5',
            },
            icon: '🌟',
          };
        case 'deep-ocean':
          return {
            style: {
              background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
              border: '1px solid #38BDF8',
              boxShadow: '0 10px 40px rgba(56, 189, 248, 0.3)',
              color: '#e0f2fe',
            },
            icon: '🌊',
          };
        case 'slate-grey':
          return {
            style: {
              background: 'linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)',
              border: '1px solid #E4E4E7',
              boxShadow: '0 10px 40px rgba(228, 228, 231, 0.3)',
              color: '#E4E4E7',
            },
            icon: '💎',
          };
        default: // default theme
          return {
            style: {
              background: 'linear-gradient(135deg, #0b1121 0%, #070b14 100%)',
              border: '1px solid #00D4FF',
              boxShadow: '0 10px 40px rgba(0, 212, 255, 0.3)',
              color: '#f1f5f9',
            },
            icon: '🚀',
          };
      }
    };

    const themeStyles = getThemeStyles();

    toast.success(
      `Welcome back, ${displayName}! ${themeStyles.icon}\n\nYou have ${userCredits} 💎 credits available. Ready for a new analysis?`,
      {
        duration: 5000,
        position: 'top-right',
        style: themeStyles.style,
        className: 'welcome-toast',
      }
    );
  };

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

  const login = async (userData: User, userCredits: number) => {
    // If is_verified is missing, fetch complete user data from /users/me
    if (userData.is_verified === undefined) {
      const completeUserData = await fetchUserData();
      if (completeUserData) {
        setUser(completeUserData.user);
        setCredits(completeUserData.credits);
        setIsAuthenticated(true);

        // 🎉 Show welcome toast for fresh login
        const userName = completeUserData.user.first_name
          ? `${completeUserData.user.first_name} ${completeUserData.user.last_name || ''}`.trim()
          : completeUserData.user.email.split('@')[0];
        showWelcomeToast(userName, completeUserData.credits);

        return;
      }
    }

    setUser(userData);
    setCredits(userCredits);
    setIsAuthenticated(true);

    // 🎉 Show welcome toast for fresh login
    const userName = userData.first_name
      ? `${userData.first_name} ${userData.last_name || ''}`.trim()
      : userData.email.split('@')[0];
    showWelcomeToast(userName, userCredits);
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