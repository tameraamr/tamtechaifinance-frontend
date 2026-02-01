import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  
  // 🔥 Proxy backend through same domain to make cookies first-party
  async rewrites() {
    // In development (localhost), use local backend
    // In production (Vercel), use the Railway
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/api/:path*',
        destination: isDevelopment 
          ? 'http://localhost:8000/:path*'  // Dev: Use local backend
          : 'https://tamtechaifinance-backend-production.up.railway.app/:path*', // Prod: Railway
      },
    ];
  },
};

export default nextConfig;