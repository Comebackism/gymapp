/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  },
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
};

module.exports = nextConfig;
