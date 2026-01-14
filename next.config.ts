import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOADER = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'slelguoygbfzlpylpxfs.supabase.co',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'v3b.fal.media',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'butlersinthebuff.com.au',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'butlersinthebuff.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.propertista.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.londonbay.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.istockphoto.com',
        pathname: '/**',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  // @ts-ignore - Turbopack configuration
  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        loaders: [LOADER]
      }
    }
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  async redirects() {
    return [
      {
        source: '/locations/:slug',
        destination: '/destinations/:slug',
        permanent: true,
      },
      {
        source: '/inspiration/alternative-hen-party-ideas',
        destination: '/blog/alternative-hen-party-ideas',
        permanent: true,
      },
      {
        source: '/inspiration/hen-party-checklist',
        destination: '/blog/hen-party-checklist',
        permanent: true,
      },
      {
        source: '/occasions/hen-party-houses',
        destination: '/hen-party-houses',
        permanent: true,
      },
      {
        source: '/occasions/weddings',
        destination: '/weddings',
        permanent: true,
      },
      {
        source: '/occasions/special-celebrations',
        destination: '/special-celebrations',
        permanent: true,
      },
      {
        source: '/occasions/weekend-breaks',
        destination: '/weekend-breaks',
        permanent: true,
      },
      {
        source: '/occasions/christmas',
        destination: '/christmas',
        permanent: true,
      },
      {
        source: '/occasions/new-year',
        destination: '/new-year',
        permanent: true,
      },
      {
        source: '/occasions/easter',
        destination: '/easter',
        permanent: true,
      },
      {
        source: '/occasions/stag-do-houses',
        destination: '/stag-do-houses',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
