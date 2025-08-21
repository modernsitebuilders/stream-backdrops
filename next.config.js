/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'streambackdrops.com',
      },
      {
        protocol: 'https',
        hostname: 'stream-backdrops-videos.s3.amazonaws.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  compress: true,
  
  experimental: {
    scrollRestoration: true,
  },
  
  // Disable Fast Refresh completely
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: /node_modules/,
        poll: false,
      }
      config.cache = false
    }
    return config
  },
  
  trailingSlash: false,
  poweredByHeader: false,
  
  generateBuildId: async () => {
    return 'streambackdrops-' + Date.now();
  },
};

module.exports = nextConfig;