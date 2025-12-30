import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  compress: true,
  // Only ignore errors in development, not production
  ...(process.env.NODE_ENV !== 'production' && {
    typescript: {
      ignoreBuildErrors: true,
    },
    reactStrictMode: false,
  }),
  // ESLint warnings don't fail builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
