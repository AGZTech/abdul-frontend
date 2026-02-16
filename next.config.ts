import type { NextConfig } from 'next';
const baseConfig: NextConfig = {
  transpilePackages: ['geist']
};

let configWithPlugins = baseConfig;

const nextConfig = configWithPlugins;
export default nextConfig;
