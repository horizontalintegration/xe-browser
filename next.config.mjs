/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        hostname: "edge.sitecorecloud.io",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
