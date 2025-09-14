/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thirsty-mcnulty-4a8oo0sig.storage.c2.liara.space",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
