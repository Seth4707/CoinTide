/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.coindesk.com'
      },
      {
        protocol: 'https',
        hostname: 'cointelegraph.com'
      },
      {
        protocol: 'https',
        hostname: 'cryptonews.com'
      },
      {
        protocol: 'https',
        hostname: 'bitcoinmagazine.com'
      },
      {
        protocol: 'https',
        hostname: 'decrypt.co'
      },
      {
        protocol: 'https',
        hostname: 'images.cointelegraph.com'
      },
      {
        protocol: 'https',
        hostname: 'static.news.bitcoin.com'
      },
      {
        protocol: 'https',
        hostname: 's3.cointelegraph.com'
      },
      {
        protocol: 'https',
        hostname: 'cryptonews.net'
      }
    ],
    domains: ['localhost'], // Add if you're using local images in development
    unoptimized: false, // Change to false to enable image optimization
  },
  reactStrictMode: true,
  swcMinify: true
}

module.exports = nextConfig









