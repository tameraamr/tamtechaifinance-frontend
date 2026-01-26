"use client";
import { useEffect, useState } from "react";
import { GoogleAnalytics } from '@next/third-parties/google';

interface ConditionalAnalyticsProps {
  gaId: string;
}

export default function ConditionalAnalytics({ gaId }: ConditionalAnalyticsProps) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check if user has given consent
    const checkConsent = () => {
      if (typeof window === "undefined") return false;
      
      // Check if user declined
      const declined = localStorage.getItem("tamtech_analytics_declined");
      if (declined === "true") return false;
      
      // Check if user accepted (cookie set by react-cookie-consent)
      const consent = document.cookie
        .split("; ")
        .find((row) => row.startsWith("tamtech_cookie_consent="));
      
      return consent !== undefined;
    };

    setHasConsent(checkConsent());

    // Listen for cookie changes (when user accepts/declines)
    const interval = setInterval(() => {
      const newConsent = checkConsent();
      if (newConsent !== hasConsent) {
        setHasConsent(newConsent);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasConsent]);

  // Only render Google Analytics if user has given consent
  if (!hasConsent) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}
