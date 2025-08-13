/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Enable React strict mode for better development
  reactStrictMode: true,
  
  // ✅ Image optimization settings (compatible version)
  images: {
    // Support modern image formats
    formats: ['image/webp', 'image/avif'],
    
    // Your domain (add your actual domain here)
    domains: ['streambackdrops.com'],
    
    // Responsive image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // ✅ Enable compression
  compress: true,
  
  // ✅ Experimental features for better performance
  experimental: {
    // Better scroll restoration
    scrollRestoration: true,
  },
  
  // ✅ Security and performance headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
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
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        // ✅ Cache images for better performance
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // ✅ Cache static assets
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // ✅ SEO-friendly redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // ✅ Add any old URLs you want to redirect
      // {
      //   source: '/old-category-name',
      //   destination: '/category/new-category-name',
      //   permanent: true,
      // },
    ];
  },
  
  // ✅ Generate sitemap and robots.txt
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ];
  },
  
  // ✅ Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // ✅ Better code splitting in development
    if (dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    
    // ✅ Optimize bundle size
    if (!dev) {
      config.optimization.minimize = true;
    }
    
    return config;
  },
  
  // ✅ Environment variables for client-side
  env: {
    SITE_URL: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000',
  },
  
  // ✅ Enable static optimization
  trailingSlash: false,
  
  // ✅ Power optimizations
  poweredByHeader: false,
  
  // ✅ Generate build ID for caching
  generateBuildId: async () => {
    return 'streambackdrops-' + Date.now();
  },
};

module.exports = nextConfig;