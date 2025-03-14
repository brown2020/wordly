/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Enable experimental features
  experimental: {
    // Next.js 15 no longer needs serverActions flag
    // optimisticClientCache is now enabled by default
  },
};

export default nextConfig;
