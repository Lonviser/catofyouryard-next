/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'catsoftoyouryard.local',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;