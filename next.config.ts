import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,

  // Enable trailing slash for SEO consistency
  trailingSlash: true,

  // Enable compression
  compress: true,

  // Optimize heavy packages
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'framer-motion',
      'echarts-for-react',
      'date-fns',
      'lodash',
    ],
  },

  // Allow images from external domains (ImgBB)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'ibb.co',
      },
      {
        protocol: 'https',
        hostname: '*.imgbb.com',
      },
    ],
  },

  // 🔒 Backend proxy removed — running in Portfolio Demo Mode
  // Original rewrites proxied /api/* to Railway backend for first-party cookies

};

export default nextConfig;