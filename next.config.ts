import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/contact.html",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/terms.html",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/disclaimer-privacy.html",
        destination: "/disclaimer-privacy",
        permanent: true,
      },
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
