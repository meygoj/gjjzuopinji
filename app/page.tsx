"use client"

import dynamic from "next/dynamic"

// 懒加载首页组件，减少服务端体积
const WelcomeScreen = dynamic(
  () => import("@/components/welcome-screen").then(mod => mod.WelcomeScreen),
  { ssr: false }
)

export default function HomePage() {
  return <WelcomeScreen />
}
