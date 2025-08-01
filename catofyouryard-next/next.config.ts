/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true, // Отключаем оптимизацию изображений
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