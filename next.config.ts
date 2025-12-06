import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://images.dog.ceo/**')],
  }
};

export default nextConfig;
