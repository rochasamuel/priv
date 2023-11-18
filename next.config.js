/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd384rvovcanpvp.cloudfront.net',
        port: '',
        pathname: '**'
      }
    ]
  }
}

module.exports = nextConfig
