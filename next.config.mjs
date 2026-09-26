import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

// GitHub Pages: the deploy workflow sets STATIC_EXPORT=1 and PAGES_BASE_PATH=/<repo>.
// Locally both are unset, so `next dev` / `next start` behave as usual.
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.PAGES_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(staticExport && { output: "export", trailingSlash: true }),
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Pin the workspace root so a stray lockfile in a parent directory isn't picked up.
  outputFileTracingRoot: projectRoot,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    optimizePackageImports: ["framer-motion", "three"],
  },
};

export default nextConfig;
