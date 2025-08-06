/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  compress: true,
  
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
    scrollRestoration: true,
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Ensure splitChunks exists and has the expected structure
      if (config.optimization && config.optimization.splitChunks) {
        if (!config.optimization.splitChunks.cacheGroups) {
          config.optimization.splitChunks.cacheGroups = {};
        }
        if (!config.optimization.splitChunks.cacheGroups.commons) {
          config.optimization.splitChunks.cacheGroups.commons = {};
        }
        config.optimization.splitChunks.cacheGroups.commons.minChunks = 2;
      }
    }
    return config;
  },
}

module.exports = nextConfig