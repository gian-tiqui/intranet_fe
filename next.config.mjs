/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8081",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "10.10.10.30",
        port: "8081",
        pathname: "/uploads/**",
      },
    ],
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
