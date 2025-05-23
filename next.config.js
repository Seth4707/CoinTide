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
      },
      {
        protocol: 'https',
        hostname: 'coin-tide.vercel.app'
      }
    ],
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig



