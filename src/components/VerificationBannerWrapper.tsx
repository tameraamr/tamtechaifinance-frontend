"use client";
import { useAuth } from '../context/AuthContext';
import VerificationBanner from './VerificationBanner';

export default function VerificationBannerWrapper({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isVerified, isLoading, suppressBanner } = useAuth();
  const showBanner = !isLoading && isLoggedIn && !isVerified && !suppressBanner;

  return (
    <>
      <VerificationBanner />
      <div className={showBanner ? "pt-20" : ""}>
        {children}
      </div>
    </>
  );
}
