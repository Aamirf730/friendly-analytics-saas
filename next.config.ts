import type { NextConfig } from "next";

/**
 * Environment variable validation
 */
function validateEnv() {
  const requiredVars = [
    "NEXTAUTH_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0 && process.env.NODE_ENV === "production") {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Validate on build/startup
try {
  validateEnv();
} catch (error) {
  console.error("Environment validation failed:", error);
}

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    domains: ["www.google.com", "lh3.googleusercontent.com"],
    formats: ["image/webp", "image/avif"],
  },

  // React strict mode
  reactStrictMode: true,
};

export default nextConfig;
