import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { hostname: 'cdn.jsdelivr.net' },
      { hostname: 'cdn.worldvectorlogo.com' },
      { hostname: 'api.iconify.design' },
      { hostname: 'unpkg.com' },
      { hostname: 'raw.githubusercontent.com' },
      { hostname: 'cdn.brandfetch.io' },
    ],
  },
};

export default nextConfig;
