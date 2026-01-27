import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  
  // 🔥 Proxy backend through same domain to make cookies first-party
  async rewrites() {
    // In development (localhost), use Railway directly
    // In production (Vercel), use the rewrite
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/api/:path*',
        destination: isDevelopment 
          ? 'https://tamtechaifinance-backend-production.up.railway.app/:path*'  // Dev: Use Railway directly
          : 'https://tamtechaifinance-backend-production.up.railway.app/:path*', // Prod: Also Railway
      },
    ];
  },
};

export default nextConfig;