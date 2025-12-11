import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "@headlessui/react"],
  },
  allowedDevOrigins: ["http://localhost:3000", "http://192.168.0.200"],
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
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 3600,
  },
  // Bundle splitting optimization
  webpack: (config, { isServer, dev }) => {
    // Split chunks for better caching
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunks
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: "react",
              priority: 40,
              chunks: "all",
            },
            ui: {
              test: /[\\/]node_modules[\\/](@headlessui|@heroicons)[\\/]/,
              name: "ui",
              priority: 30,
              chunks: "all",
            },
            icons: {
              test: /[\\/]node_modules[\\/](lucide-react|react-feather)[\\/]/,
              name: "icons",
              priority: 25,
              chunks: "all",
            },
            sentry: {
              test: /[\\/]node_modules[\\/](@sentry|@opentelemetry)[\\/]/,
              name: "sentry",
              priority: 22,
              chunks: "all",
            },
            utils: {
              test: /[\\/]node_modules[\\/](clsx|tailwind-merge|class-variance-authority)[\\/]/,
              name: "utils",
              priority: 20,
              chunks: "all",
            },
            // Common chunks
            commons: {
              name: "commons",
              minChunks: 2,
              priority: 10,
              chunks: "all",
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    // CDN configuration for production
    if (!isServer && !dev && process.env.CDN_BASE_URL) {
      config.output.publicPath = `${process.env.CDN_BASE_URL}/_next/`;
    }

    return config;
  },
  // Turbopack configuration for Next.js 16 compatibility
  turbopack: {},
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Asset CDN configuration
  assetPrefix: process.env.CDN_BASE_URL || undefined,
};

export default nextConfig;
