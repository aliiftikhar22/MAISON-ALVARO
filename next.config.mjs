import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site: `next build` writes the deployable site to /out
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Explicit alias so "@/..." resolves regardless of tsconfig detection
  webpack: (config) => {
    config.resolve.alias = { ...config.resolve.alias, '@': path.join(root, 'src') };
    return config;
  },
};

export default nextConfig;
