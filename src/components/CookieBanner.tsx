"use client";
import CookieConsent from "react-cookie-consent";
import Link from "next/link";
import { useTranslation } from "../context/TranslationContext";

export default function CookieBanner() {
  const { t } = useTranslation();

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Reject All"
      enableDeclineButton
      cookieName="tamtech_cookie_consent"
      style={{
        background: "rgba(15, 23, 42, 0.98)",
        borderTop: "1px solid rgba(148, 163, 184, 0.2)",
        backdropFilter: "blur(10px)",
        padding: "20px",
        alignItems: "center",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.3)",
      }}
      buttonStyle={{
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        color: "white",
        fontSize: "14px",
        fontWeight: "600",
        borderRadius: "8px",
        padding: "12px 28px",
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
      }}
      declineButtonStyle={{
        background: "rgba(71, 85, 105, 0.5)",
        color: "white",
        fontSize: "14px",
        fontWeight: "600",
        borderRadius: "8px",
        padding: "12px 28px",
        border: "1px solid rgba(148, 163, 184, 0.3)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        marginRight: "12px",
      }}
      contentStyle={{
        flex: "1 0 300px",
        margin: "0 20px",
        color: "#e2e8f0",
        fontSize: "14px",
        lineHeight: "1.6",
      }}
      expires={365}
      onAccept={() => {
        // Reload page to load Google Analytics
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }}
      onDecline={() => {
        // Store rejection and ensure GA doesn't load
        if (typeof window !== "undefined") {
          localStorage.setItem("tamtech_analytics_declined", "true");
        }
      }}
    >
      <div className="flex flex-col gap-2">
        <p className="text-white font-semibold text-base">
          🍪 We Value Your Privacy
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          We use cookies to enhance your experience and analyze site traffic with Google Analytics. 
          Functional cookies (for login and preferences) are always active. 
          {" "}
          <Link 
            href="/privacy" 
            className="text-blue-400 hover:text-blue-300 underline font-medium transition-colors"
          >
            Learn more in our Privacy Policy
          </Link>
          .
        </p>
      </div>
    </CookieConsent>
  );
}
