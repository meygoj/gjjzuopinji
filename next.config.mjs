/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 生产环境极致压缩与优化
  compress: true,
  // 关闭所有源映射，减小打包体积
  productionBrowserSourceMaps: false,
  // 优化构建输出
  output: 'standalone', // 输出独立模式，优化依赖打包
  // 减少构建时消除未使用代码
  swcMinify: true,
  // 禁用React严格模式优化
  reactStrictMode: false, // 临时禁用严格模式可减少体积
  // 实验性功能：极致优化
  experimental: {
    // 优化包导入
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'date-fns',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-button',
      '@radix-ui/react-card',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-select',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
    ],
    // 优化服务器组件打包
    optimizeServerReact: true,
    // 优化字体预加载
    optimizeCss: true,
    // 减小服务端渲染体积
    serverActions: {
      bodySizeLimit: '500mb',
    },
    // 构建时删除未使用文件
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // 进一步减小服务端打包优化
      if (isServer) {
        config.optimization.minimize = true
      }
      return config
    }
  },
  // 减少文件哈希命名
  trailingSlash: false,
}

export default nextConfig
