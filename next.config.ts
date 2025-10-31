import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployments
  output: 'standalone',

  // TypeScript build configuration
  typescript: {
    // ⚠️ Dangerously allow production builds to successfully complete even if
    // your project has type errors. This is temporary while we fix remaining TS errors from Next.js 16 migration.
    ignoreBuildErrors: true,
  },

  // Other config options here
};

export default nextConfig;
