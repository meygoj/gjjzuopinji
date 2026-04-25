/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 生产环境开启代码全量压缩与优化
  compress: true,
  // 关闭生产环境源映射，减小打包体积
  productionBrowserSourceMaps: false,
  // 增加API请求体大小限制
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
    // 大体积依赖包按需导入优化
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },
}

export default nextConfig
