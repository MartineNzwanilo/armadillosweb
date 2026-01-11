import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3005' },
      { protocol: 'http', hostname: '127.0.0.1', port: '3005' },
      { protocol: 'http', hostname: '::1', port: '3005' },
      { protocol: 'http', hostname: '192.168.20.169', port: '3005' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://192.168.20.169:3005/uploads/:path*'
      },
      {
        source: '/api/v1/:path*',
        destination: 'http://192.168.20.169:3005/api/v1/:path*'
      }
    ];
  }
};

export default nextConfig;
