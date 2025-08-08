// next.config.js - Disable Fast Refresh to stop the loop
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300
    };
    return config;
  }
};

module.exports = nextConfig;