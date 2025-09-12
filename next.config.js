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

  // ✅ ADD THIS: Handle redirects for old URLs (fixes 404s and redirects)
  async redirects() {
    return [
      // Redirect old premium URLs to main categories
      {
        source: '/premium',
        destination: '/category/office-spaces',
        permanent: true,
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
        permanent: true,
      },
      {
        source: '/category/premium-4k',
        destination: '/category/office-spaces', 
        permanent: true,
      },
      // Redirect old category names that might be causing 404s
      {
        source: '/category/home-offices',
        destination: '/category/office-spaces',
        permanent: true,
      },
      {
        source: '/category/executive-offices',
        destination: '/category/office-spaces',
        permanent: true,
      },
      {
        source: '/category/lobbies',
        destination: '/category/ambient-lighting',
        permanent: true,
      },
      {
        source: '/category/private-offices',
        destination: '/category/office-spaces',
        permanent: true,
      },
      // Redirect any old blog URLs
      {
        source: '/blog-virtual-background-guide',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog-remote-work-productivity',
        destination: '/blog',
        permanent: true,
      },
    ];
  },

  // ✅ ADD THIS: Handle headers for better SEO (prevents some server errors)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // Cache control for static assets
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;