import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
  },
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.0.200",
  ],
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.football-website.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.football-website.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
