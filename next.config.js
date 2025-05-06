/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverOptions: {
    hostname: 'localhost',
  },
}

module.exports = nextConfig 