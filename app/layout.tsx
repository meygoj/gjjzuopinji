import type { Metadata } from 'next'
import { Noto_Sans_SC, ZCOOL_QingKe_HuangYou, VT323 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ToastProvider } from '@/components/pixel-toast'
import './globals.css'

const notoSans = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
})

const zcool = ZCOOL_QingKe_HuangYou({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-zcool',
  display: 'swap',
})

const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vt323',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '郭建军-创意营销操盘手.portfolio',
  description: '一个暖色像素风格的个人作品集，收藏影像与动态艺术。',
  generator: 'v0.app',
}

export const viewport = {
  themeColor: '#f5d9a8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSans.variable} ${zcool.variable} ${vt323.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
