import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://ntikaapp-api.vercel.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;
