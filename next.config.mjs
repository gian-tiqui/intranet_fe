/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/post/**",
      },
      {
        protocol: "https",
        hostname: "intranet-api-4yk4.onrender.com",
        pathname: "/uploads/post/**",
      },
      // Production: 172.25.65.93, Development: localhost
      {
        protocol: "http",
        hostname: "localhost",
        port: "8081",
        pathname: "/uploads/post/**",
      },
    ],
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
