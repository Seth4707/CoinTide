/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Changed from 'standalone' to 'export'
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
    unoptimized: true
  },
  trailingSlash: true,
  distDir: '.next',
  // Add basePath if you're not deploying to the root
  // basePath: '',
}

module.exports = nextConfig


