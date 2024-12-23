/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "intranet-api-4yk4.onrender.com",
        pathname: "/uploads/post/**",
      },
      // Production: 172.25.65.93, Development: localhost
      {
        protocol: "http",
        hostname: "172.25.65.93",
        port: "8081",
        pathname: "/uploads/post/**",
      },
    ],
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
