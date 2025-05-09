/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  experimental: {
    serverActions: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Ensure images are optimized
  images: {
<<<<<<< HEAD
    domains: ['localhost', 'lh3.googleusercontent.com', 'graph.facebook.com'],
    unoptimized: false,
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth/signin',
        permanent: true,
      },
      // ...other redirects
    ];
=======
    domains: ['localhost'],
    unoptimized: false,
>>>>>>> dc88bcb52c9f7dacba2cf72bf175ed0ac14d1845
  },
}

module.exports = nextConfig 