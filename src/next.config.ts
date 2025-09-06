
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pdscc-images-website-2025.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      }
    ],
  },
   webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: [
        '**/.genkit/**',
        '**/.firebase/**',
      ],
    }
    return config
  },
  async redirects() {
    return [
      {
        source: '/performers',
        destination: '/perform',
        permanent: true,
      },
       {
        source: '/performers/register',
        destination: '/perform/register',
        permanent: true,
      },
      {
        source: '/verify-ticket',
        destination: '/admin/check-in',
        permanent: true,
      },
       {
        source: '/admin/verify-ticket',
        destination: '/admin/check-in',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
