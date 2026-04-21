"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PixelBackground } from "./pixel-background"
import { useEffect, useState, useRef } from "react"

export function WelcomeScreen() {
  const [mounted, setMounted] = useState(false)
  const [buttonPressed, setButtonPressed] = useState(false)
  const [dataPressed, setDataPressed] = useState<number | null>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 按钮触摸效果
  const handleButtonTouchStart = () => {
    setButtonPressed(true)
    longPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate([10, 50, 10])
      }
    }, 500)
  }

  const handleButtonTouchEnd = () => {
    setButtonPressed(false)
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  // 数据卡片触摸效果
  const handleDataTouchStart = (index: number) => {
    setDataPressed(index)
    if (navigator.vibrate) {
      navigator.vibrate(5)
    }
  }

  const handleDataTouchEnd = () => {
    setDataPressed(null)
  }

  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-pixel-cream">
      {/* 动态像素背景 */}
      <PixelBackground density={16} speed={0.0009} />

      {/* 扫描线叠加 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(60,28,20,0.6) 0px, rgba(60,28,20,0.6) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* 四角像素装饰 */}
      <PixelCornerDecor />

      {/* 主内容 */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10 px-6 text-center">
        <div className="flex items-center gap-3 rounded-none border-2 border-pixel-coffee/70 bg-pixel-cream/70 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.3em] text-pixel-coffee backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse bg-pixel-orange" />
          新媒体操盘手 · 创意营销人
        </div>

        <h1
          className={`font-display text-5xl leading-[1.05] text-balance sm:text-6xl md:text-7xl lg:text-8xl ${
            mounted ? "gradient-text" : "text-pixel-terracotta"
          }`}
        >
          郭建军
          <br />
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            新媒体 × 创意营销作品集
          </span>
        </h1>

        <p className="max-w-xl text-pretty text-base leading-relaxed text-pixel-coffee/90 sm:text-lg">
          将 AIGC 转化为可量化的商业增长。
          <br />
          爆款直播 · 内容工业化 · 全域流量变现 —— 用技术杠杆撬动真实业务结果。
        </p>

        {/* 进入按钮 */}
        <Link
          href="/work"
          onTouchStart={handleButtonTouchStart}
          onTouchEnd={handleButtonTouchEnd}
          onTouchCancel={handleButtonTouchEnd}
          onMouseDown={handleButtonTouchStart}
          onMouseUp={handleButtonTouchEnd}
          onMouseLeave={handleButtonTouchEnd}
          style={{
            transform: buttonPressed ? 'translateX(4px) translateY(4px) scale(0.98)' : 'translateX(0) translateY(0)',
            boxShadow: buttonPressed 
              ? '0 0 0 0 rgba(92,48,38,0)' 
              : '6px 6px 0 0 rgba(92,48,38,0.35)',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          className="group relative mt-2 inline-flex items-center gap-4 border-2 border-pixel-coffee bg-pixel-coffee px-8 py-4 font-display text-xl text-pixel-cream shadow-[6px_6px_0_0_rgba(92,48,38,0.35)] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(92,48,38,0.35)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        >
          <span className="relative">
            进入作品集
            <span className="pixel-cursor ml-1 inline-block h-4 w-2 translate-y-[2px] bg-pixel-amber" />
          </span>
          <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />

          {/* 像素边角装饰 */}
          <span className="absolute -left-1 -top-1 h-2 w-2 bg-pixel-amber" />
          <span className="absolute -right-1 -top-1 h-2 w-2 bg-pixel-amber" />
          <span className="absolute -bottom-1 -left-1 h-2 w-2 bg-pixel-amber" />
          <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-pixel-amber" />
          
          {/* 触摸装饰效果 */}
          {buttonPressed && (
            <>
              <div className="absolute inset-0 bg-pixel-amber/30 animate-pulse" />
              <div className="absolute inset-0 border-2 border-pixel-amber/60" />
            </>
          )}
        </Link>

        <div className="float-hint font-mono text-xs uppercase tracking-[0.4em] text-pixel-coffee/70">
          Press Start · HR 专享通道
        </div>
      </div>

      {/* 底部数据条 */}
      <div className="absolute bottom-4 left-0 right-0 z-10 mx-auto flex w-full max-w-4xl items-stretch justify-between gap-0 border-2 border-pixel-coffee/80 bg-pixel-coffee text-pixel-cream sm:bottom-6">
        {[
          ["50万+", "单场 GMV"],
          ["15K/日", "带货峰值"],
          ["50%↑", "流程人效"],
          ["98%", "客户满意度"],
        ].map(([num, label], i) => (
          <div
            key={num}
            onTouchStart={() => handleDataTouchStart(i)}
            onTouchEnd={handleDataTouchEnd}
            onTouchCancel={handleDataTouchEnd}
            onMouseDown={() => handleDataTouchStart(i)}
            onMouseUp={handleDataTouchEnd}
            onMouseLeave={handleDataTouchEnd}
            style={{
              transform: dataPressed === i ? 'scale(0.95)' : 'scale(1)',
              backgroundColor: dataPressed === i ? 'rgba(255,156,116,0.3)' : 'transparent',
              transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className={`flex flex-1 flex-col items-center justify-center px-2 py-2 text-center sm:py-3 cursor-pointer ${
              i > 0 ? "border-l-2 border-pixel-cream/20" : ""
            }`}
          >
            <span className="font-display text-base leading-none text-pixel-amber sm:text-xl">
              {num}
            </span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-pixel-cream/70 sm:text-[10px]">
              {label}
            </span>
            {/* 手机端提示 */}
            <span className="mt-1 font-mono text-[8px] text-pixel-amber/60 sm:hidden">
              点击查看
            </span>
          </div>
        ))}
      </div>
    </main>
  )
}

function PixelCornerDecor() {
  const pixels = [
    // 左上
    "top-4 left-4",
    "top-4 left-10",
    "top-10 left-4",
    // 右上
    "top-4 right-4",
    "top-4 right-10",
    "top-10 right-4",
    // 左下
    "bottom-4 left-4",
    "bottom-4 left-10",
    "bottom-10 left-4",
    // 右下
    "bottom-4 right-4",
    "bottom-4 right-10",
    "bottom-10 right-4",
  ]

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      {pixels.map((pos, i) => (
        <span
          key={i}
          className={`absolute h-2 w-2 bg-pixel-coffee ${pos}`}
          style={{ opacity: 0.8 }}
        />
      ))}
    </div>
  )
}
