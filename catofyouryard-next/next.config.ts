// next.config.js
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
  async rewrites() {
    return [
      {
        source: '/wp-json/:path*',
        destination: 'http://catsoftoyouryard.local/wp-json/:path*',
      },
    ];
  },
};

module.exports = nextConfig;