/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // ✅ Enable for better development experience
  swcMinify: true,       // ✅ Faster builds
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year cache for your virtual backgrounds
  },
  
  // Only add webpack config if you're having file watching issues
  webpack: (config, { dev, isServer }) => {
    // Only enable polling in specific environments where needed
    if (dev && !isServer && process.env.ENABLE_POLLING) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300
      };
    }
    return config;
  }
};

module.exports = nextConfig;