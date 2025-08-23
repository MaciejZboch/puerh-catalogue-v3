import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   async rewrites() {
    return [
      {
        source: "/api/:path*",   // frontend path
        destination: "http://localhost:4000/:path*", // backend port
      },
    ];
  }
};

export default nextConfig;
