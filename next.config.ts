import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ✅ Your existing config (keep it!)
  // Example:
  // images: { domains: ['i.imgflip.com'] },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
