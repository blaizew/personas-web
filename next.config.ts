import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/chat': ['./personas/**/*'],
  },
};

export default nextConfig;
