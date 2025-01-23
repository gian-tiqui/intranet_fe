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
      {
        protocol: "http",
        hostname: "10.10.10.30",
        port: "8081",
        pathname: "/uploads/post/**",
      },
    ],
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
