import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: export' for Railway deployment (use server mode)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
