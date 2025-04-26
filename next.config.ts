import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "https://cdn.sanity.io|cdn.sanity.io",
                pathname: '**',
            },
        ],
    },
};

export default nextConfig;
