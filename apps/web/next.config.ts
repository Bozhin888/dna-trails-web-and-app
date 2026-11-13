import type { NextConfig } from 'next';

// The site UI is the approved Prototype 2, served as a static single-page app
// from /public. Next.js adds the backend (accounts, passes, payments) under /api.
const config: NextConfig = {
  transpilePackages: ['@dna/data', '@dna/brand'],
  async rewrites() {
    return [{ source: '/', destination: '/index.html' }];
  },
};
export default config;
