/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.LIARA_URL?.replace(/^https?:\/\//, ""),
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
