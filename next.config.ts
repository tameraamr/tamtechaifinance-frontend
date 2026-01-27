import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  
  // 🔥 Proxy backend through same domain to make cookies first-party
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://tamtechaifinance-backend-production.up.railway.app/:path*',
      },
    ];
  },
};

export default nextConfig;