/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 生产环境压缩与优化
  compress: true,
  // 关闭生产源映射，减小打包体积
  productionBrowserSourceMaps: false,
  // 实验性功能优化
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'date-fns',
    ],
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
}

export default nextConfig
